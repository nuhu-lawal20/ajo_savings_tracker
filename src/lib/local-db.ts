import Dexie, { type Table } from "dexie";

export interface LocalCircle {
  id: string;
  name: string;
  status: string;
  contribution_amount: number;
  max_members: number;
  current_round: number;
  frequency: string;
  invite_code: string;
  creator_id: string;
  created_at: string;
}

export interface LocalTransaction {
  id: string;
  circle_id: string;
  user_id: string;
  amount: number;
  type: string;
  status: string;
  round_number: number;
  paystack_reference: string;
  created_at: string;
}

export interface SyncQueueItem {
  id?: number;
  action: string;
  payload: Record<string, unknown>;
  created_at: string;
}

class KadasheLocalDB extends Dexie {
  circles!: Table<LocalCircle>;
  transactions!: Table<LocalTransaction>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("kadasheDB");

    this.version(1).stores({
      circles: "id, status, creator_id",
      transactions: "id, circle_id, user_id, status, type",
      syncQueue: "++id, action, created_at",
    });
  }
}

export const localDB = new KadasheLocalDB();

// --- Mirror helpers ---

export async function cacheCircles(circles: LocalCircle[]) {
  await localDB.circles.bulkPut(circles);
}

export async function cacheTransactions(transactions: LocalTransaction[]) {
  await localDB.transactions.bulkPut(transactions);
}

export async function getOfflineCircles(): Promise<LocalCircle[]> {
  return localDB.circles.toArray();
}

export async function getOfflineTransactions(circleId?: string): Promise<LocalTransaction[]> {
  if (circleId) {
    return localDB.transactions.where("circle_id").equals(circleId).toArray();
  }
  return localDB.transactions.toArray();
}

export async function queueOfflineAction(action: string, payload: Record<string, unknown>) {
  await localDB.syncQueue.add({
    action,
    payload,
    created_at: new Date().toISOString(),
  });
}

export async function flushSyncQueue() {
  const items = await localDB.syncQueue.toArray();
  if (items.length === 0) return;

  for (const item of items) {
    try {
      // Replay queued action against the API
      if (item.action === "join_circle") {
        const res = await fetch("/api/circles/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item.payload),
        });
        if (res.ok) {
          await localDB.syncQueue.delete(item.id!);
        }
      }
      // More action types can be added here (create_circle, etc.)
    } catch {
      // Leave in queue — will retry on next reconnect
    }
  }
}
