import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/config";
import { COLLECTIONS, limit, orderBy, queryCollection, updateDocById } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type { AuditLog, UserProfile, UserRole } from "@/types";

async function countWhere(collectionName: string, field: string, value: unknown): Promise<number> {
  const snap = await getCountFromServer(query(collection(getFirebaseDb(), collectionName), where(field, "==", value)));
  return snap.data().count;
}

export function useAdminMetrics() {
  return useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: async () => {
      const [
        publishedPoliticians,
        pendingPoliticians,
        convictions,
        acquittals,
        pendingAppeals,
        openInvestigations,
        tier1Sources,
        tier2Sources,
        tier3Sources,
        tier4Sources,
      ] = await Promise.all([
        countWhere(COLLECTIONS.politicians, "publicationStatus", "published"),
        countWhere(COLLECTIONS.politicians, "publicationStatus", "review"),
        countWhere(COLLECTIONS.cases, "legalStage", "convicted"),
        countWhere(COLLECTIONS.cases, "legalStage", "acquitted"),
        countWhere(COLLECTIONS.cases, "legalStage", "appeal_pending"),
        countWhere(COLLECTIONS.investigations, "currentStatus", "open"),
        countWhere(COLLECTIONS.sources, "tier", 1),
        countWhere(COLLECTIONS.sources, "tier", 2),
        countWhere(COLLECTIONS.sources, "tier", 3),
        countWhere(COLLECTIONS.sources, "tier", 4),
      ]);
      return {
        publishedPoliticians,
        pendingPoliticians,
        convictions,
        acquittals,
        pendingAppeals,
        openInvestigations,
        sourcesByTier: { 1: tier1Sources, 2: tier2Sources, 3: tier3Sources, 4: tier4Sources },
      };
    },
  });
}

export function usePoliticiansWithIdentityConflicts() {
  return useQuery({
    queryKey: ["admin", "unresolvedIdentity"],
    queryFn: () =>
      queryCollection<{ id: string; fullName: string; country: string }>(COLLECTIONS.politicians, [
        where("identityConfidence", "==", "unresolved"),
      ]),
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => queryCollection<UserProfile>(COLLECTIONS.users, [orderBy("displayName")]),
  });
}

export function useRecentAuditLogs() {
  return useQuery({
    queryKey: ["admin", "auditLogs"],
    queryFn: () => queryCollection<AuditLog>(COLLECTIONS.auditLogs, [orderBy("createdAt", "desc"), limit(50)]),
  });
}

export function useSetUserRole(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, role }: { uid: string; role: UserRole }) => {
      await updateDocById(COLLECTIONS.users, uid, { role });
      await writeAuditLog({ actorId, action: `role:${role}`, entityType: "user", entityId: uid });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useSetUserActive(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ uid, isActive }: { uid: string; isActive: boolean }) => {
      await updateDocById(COLLECTIONS.users, uid, { isActive });
      await writeAuditLog({ actorId, action: isActive ? "activate" : "deactivate", entityType: "user", entityId: uid });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
