"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useCircleRealtime(circleId: string, initialTransactions: any[], initialMembers: any[]) {
  const [transactions, setTransactions] = useState<any[]>(initialTransactions);
  const [members, setMembers] = useState<any[]>(initialMembers);
  const [isConnected, setIsConnected] = useState(true);
  const [newEventRowId, setNewEventRowId] = useState<string | null>(null);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  useEffect(() => {
    const supabase = createClient();


    // Create unique subscription channel for this circle
    const channel = supabase
      .channel(`circle-realtime:${circleId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `circle_id=eq.${circleId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTransactions((prev) => [payload.new, ...prev]);
            setNewEventRowId(payload.new.id);
            setTimeout(() => setNewEventRowId(null), 4000);
          } else if (payload.eventType === "UPDATE") {
            setTransactions((prev) =>
              prev.map((tx) => (tx.id === payload.new.id ? { ...tx, ...payload.new } : tx))
            );
            setNewEventRowId(payload.new.id);
            setTimeout(() => setNewEventRowId(null), 4000);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "memberships",
          filter: `circle_id=eq.${circleId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMembers((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setMembers((prev) =>
              prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m))
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [circleId]);

  return {
    transactions,
    members,
    isConnected,
    newEventRowId,
  };
}
