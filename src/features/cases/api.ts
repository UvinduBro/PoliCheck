import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { COLLECTIONS, createDoc, getDocById, publicationConstraint, updateDocById } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type { Claim, LegalCase, LegalEvent, UserRole } from "@/types";
import { queryCollection, where } from "@/lib/firebase/firestore";

/**
 * Every case visible to `role` — used by global search and cross-politician case listings.
 * Sorted client-side: combining publicationConstraint's equality filter with a server-side
 * orderBy would require a composite index for a public/anonymous caller's query shape.
 */
export function useAllCases(role: UserRole | undefined) {
  return useQuery({
    queryKey: ["cases", "all", role],
    queryFn: async () => {
      const results = await queryCollection<LegalCase>(COLLECTIONS.cases, publicationConstraint(role));
      return results.sort((a, b) => a.caseName.localeCompare(b.caseName));
    },
  });
}

export function useCase(id: string | undefined) {
  return useQuery({
    queryKey: ["case", id],
    queryFn: () => getDocById<LegalCase>(COLLECTIONS.cases, id as string),
    enabled: Boolean(id),
  });
}

export function useCaseClaims(caseId: string | undefined) {
  return useQuery({
    queryKey: ["claims", "byCase", caseId],
    queryFn: () => queryCollection<Claim>(COLLECTIONS.claims, [where("caseId", "==", caseId)]),
    enabled: Boolean(caseId),
  });
}

export function useCaseEvents(caseId: string | undefined) {
  return useQuery({
    queryKey: ["legalEvents", "byCase", caseId],
    queryFn: () => queryCollection<LegalEvent>(COLLECTIONS.legalEvents, [where("caseId", "==", caseId)]),
    enabled: Boolean(caseId),
  });
}

export function usePoliticianClaims(politicianId: string | undefined) {
  return useQuery({
    queryKey: ["claims", "byPolitician", politicianId],
    queryFn: () => queryCollection<Claim>(COLLECTIONS.claims, [where("politicianId", "==", politicianId)]),
    enabled: Boolean(politicianId),
  });
}

export function useCreateCase(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<LegalCase, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
      const id = await createDoc(COLLECTIONS.cases, { ...data, createdBy: actorId });
      await writeAuditLog({ actorId, action: "create", entityType: "case", entityId: id, after: data });
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function usePublishCase(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LegalCase["publicationStatus"] }) => {
      await updateDocById(COLLECTIONS.cases, id, { publicationStatus: status, reviewedBy: actorId });
      await writeAuditLog({ actorId, action: `publicationStatus:${status}`, entityType: "case", entityId: id });
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["case", variables.id] });
    },
  });
}
