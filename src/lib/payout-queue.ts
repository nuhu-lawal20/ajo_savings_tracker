/**
 * Programmatic Payout Queue Allocation Algorithm (Kadashe Decentralized Rotation Architecture)
 * 
 * CORE LAWS:
 * 1. Organizer Payout Immunity Law (ABSOLUTE):
 *    Under NO circumstances can the Circle Organizer / Creator take Turn #1 (Position #1).
 *    Turn #1 is strictly reserved for a non-organizer peer member to eliminate moral hazard
 *    and prevent fraudulent creation for instant cashouts.
 * 
 * 2. Primary Reputation Sort:
 *    Members are sorted by AI Trust Score DESC (Higher reputation = earlier rotational payout slot).
 * 
 * 3. Tie-Breaking & Servant Leadership:
 *    If the Organizer shares equal score with another member, the Organizer always yields.
 *    If two regular members share equal score, the one who joined earlier gets priority.
 */

export interface QueueMember {
  id: string;
  user_id: string;
  joined_at?: string;
  profile?: {
    trust_score?: number;
  } | null;
}

export function sortMembersForPayoutQueue<T extends QueueMember>(
  members: T[],
  creatorId: string
): T[] {
  if (!members || members.length <= 1) {
    return members ?? [];
  }

  // 1. Separate regular peer members from the circle creator/organizer
  const organizer = members.find((m) => m.user_id === creatorId);
  const regularMembers = members.filter((m) => m.user_id !== creatorId);

  // If there are no regular members (e.g. only organizer in circle), return as is
  if (regularMembers.length === 0) {
    return members;
  }

  // 2. Sort all regular peer members by Trust Score DESC, then Join Date ASC
  regularMembers.sort((a, b) => {
    const scoreA = a.profile?.trust_score ?? 50;
    const scoreB = b.profile?.trust_score ?? 50;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    if (a.joined_at && b.joined_at) {
      return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
    }

    return 0;
  });

  // If no organizer is found in the list, return sorted regular members
  if (!organizer) {
    return regularMembers;
  }

  // 3. LAW 1 ENFORCEMENT: Turn #1 is GUARANTEED to the top-scoring regular member.
  const turn1Member = regularMembers[0];
  const remainingRegulars = regularMembers.slice(1);

  // 4. Sort remaining regular members + organizer for positions #2 through #N
  const remainingSorted = [...remainingRegulars, organizer].sort((a, b) => {
    const scoreA = a.profile?.trust_score ?? 50;
    const scoreB = b.profile?.trust_score ?? 50;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    // Tie-breaker: Organizer always yields to regular members
    if (a.user_id === creatorId) return 1;
    if (b.user_id === creatorId) return -1;

    if (a.joined_at && b.joined_at) {
      return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
    }

    return 0;
  });

  // Return final immutable queue: Turn #1 is ALWAYS a regular member, never the organizer
  return [turn1Member, ...remainingSorted];
}
