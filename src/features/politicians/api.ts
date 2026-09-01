import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  COLLECTIONS,
  createDoc,
  getDocById,
  limit,
  orderBy,
  queryCollection,
  updateDocById,
  where,
} from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type { QueryConstraint } from "firebase/firestore";
import type {
  Investigation,
  LegalCase,
  LegalEvent,
  PoliticalPosition,
  Politician,
  Source,
  UserRole,
} from "@/types";

/**
 * Firestore only allows an unauthenticated/public list query when the query itself
 * proves every result satisfies the security rule (publicationStatus == "published").
 * Researcher+ can query without that constraint since the rule's isResearcher()
 * branch holds regardless of document content.
 */
function publicationConstraint(role: UserRole | undefined): QueryConstraint[] {
  if (role === "researcher" || role === "reviewer" || role === "admin") return [];
  return [where("publicationStatus", "==", "published")];
}

export function usePoliticians(role: UserRole | undefined, filters?: { country?: string }) {
  return useQuery({
    queryKey: ["politicians", role, filters],
    queryFn: async () => {
      const constraints: QueryConstraint[] = [...publicationConstraint(role), orderBy("fullName")];
      if (filters?.country) constraints.push(where("country", "==", filters.country));
      return queryCollection<Politician>(COLLECTIONS.politicians, constraints);
    },
  });
}

export function useRecentlyUpdatedPoliticians(role: UserRole | undefined) {
  return useQuery({
    queryKey: ["politicians", "recent", role],
    queryFn: () =>
      queryCollection<Politician>(COLLECTIONS.politicians, [
        ...publicationConstraint(role),
        orderBy("updatedAt", "desc"),
        limit(8),
      ]),
  });
}

export function usePolitician(id: string | undefined) {
  return useQuery({
    queryKey: ["politician", id],
    queryFn: () => getDocById<Politician>(COLLECTIONS.politicians, id as string),
    enabled: Boolean(id),
  });
}

export function usePoliticalPositions(politicianId: string | undefined) {
  return useQuery({
    queryKey: ["politicalPositions", politicianId],
    queryFn: () =>
      queryCollection<PoliticalPosition>(COLLECTIONS.politicalPositions, [
        where("politicianId", "==", politicianId),
      ]),
    enabled: Boolean(politicianId),
  });
}

export function usePoliticianCases(politicianId: string | undefined, role: UserRole | undefined) {
  return useQuery({
    queryKey: ["cases", "byPolitician", politicianId, role],
    queryFn: () =>
      queryCollection<LegalCase>(COLLECTIONS.cases, [
        where("politicianIds", "array-contains", politicianId),
        ...publicationConstraint(role),
      ]),
    enabled: Boolean(politicianId),
  });
}

export function usePoliticianInvestigations(politicianId: string | undefined, role: UserRole | undefined) {
  return useQuery({
    queryKey: ["investigations", "byPolitician", politicianId, role],
    queryFn: () =>
      queryCollection<Investigation>(COLLECTIONS.investigations, [
        where("politicianIds", "array-contains", politicianId),
        ...publicationConstraint(role),
      ]),
    enabled: Boolean(politicianId),
  });
}

export function usePoliticianEvents(politicianId: string | undefined, role: UserRole | undefined) {
  return useQuery({
    queryKey: ["legalEvents", "byPolitician", politicianId, role],
    queryFn: () =>
      queryCollection<LegalEvent>(COLLECTIONS.legalEvents, [
        where("politicianIds", "array-contains", politicianId),
        ...publicationConstraint(role),
      ]),
    enabled: Boolean(politicianId),
  });
}

/** Sources aren't linked to a politician directly — collect the union of sourceIds referenced by their cases, investigations, and events. */
export function usePoliticianSources(sourceIds: string[]) {
  const uniqueIds = Array.from(new Set(sourceIds)).sort();
  return useQuery({
    queryKey: ["sources", "byIds", uniqueIds],
    queryFn: async () => {
      const results = await Promise.all(
        uniqueIds.map((id) => getDocById<Source>(COLLECTIONS.sources, id)),
      );
      return results.filter((s): s is Source => s !== null);
    },
    enabled: uniqueIds.length > 0,
  });
}

/** Composes cases/investigations/events/sources into the legal-status dashboard snapshot for one politician. */
export function useLegalStatusDashboard(politicianId: string | undefined, role: UserRole | undefined) {
  const casesQuery = usePoliticianCases(politicianId, role);
  const investigationsQuery = usePoliticianInvestigations(politicianId, role);
  const eventsQuery = usePoliticianEvents(politicianId, role);
  const eventSourceIds = (eventsQuery.data ?? []).flatMap((e) => e.sourceIds);
  const sourcesQuery = usePoliticianSources(eventSourceIds);

  return {
    cases: casesQuery.data ?? [],
    investigations: investigationsQuery.data ?? [],
    events: eventsQuery.data ?? [],
    sources: sourcesQuery.data ?? [],
    isLoading:
      casesQuery.isLoading || investigationsQuery.isLoading || eventsQuery.isLoading || sourcesQuery.isLoading,
  };
}

export function useCreatePolitician(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Politician, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
      const id = await createDoc(COLLECTIONS.politicians, { ...data, createdBy: actorId });
      await writeAuditLog({
        actorId,
        action: "create",
        entityType: "politician",
        entityId: id,
        after: data,
      });
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["politicians"] }),
  });
}

export function useUpdatePolitician(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Politician> }) => {
      await updateDocById(COLLECTIONS.politicians, id, data);
      await writeAuditLog({ actorId, action: "update", entityType: "politician", entityId: id, after: data });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      queryClient.invalidateQueries({ queryKey: ["politician", variables.id] });
    },
  });
}

export function usePublishPolitician(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Politician["publicationStatus"] }) => {
      await updateDocById(COLLECTIONS.politicians, id, { publicationStatus: status, reviewedBy: actorId });
      await writeAuditLog({
        actorId,
        action: `publicationStatus:${status}`,
        entityType: "politician",
        entityId: id,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["politicians"] });
      queryClient.invalidateQueries({ queryKey: ["politician", variables.id] });
    },
  });
}
