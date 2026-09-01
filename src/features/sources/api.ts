import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { COLLECTIONS, createDoc, getDocById, orderBy, queryCollection, where } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type { Source, UserRole } from "@/types";

/** Researcher+ only — used by the source-picker checklists on researcher forms. */
export function useSources() {
  return useQuery({
    queryKey: ["sources", "all"],
    queryFn: () => queryCollection<Source>(COLLECTIONS.sources, [orderBy("title")]),
  });
}

/**
 * Sources visible to `role` — used by global search and public source browsing. The
 * `sources` security rule reads `isResearcher() || verificationStatus == "verified"`,
 * so a public/unauthenticated query must include the matching filter or Firestore
 * rejects the whole query (see publicationConstraint for the same pattern elsewhere).
 */
export function useSearchableSources(role: UserRole | undefined) {
  const isResearcher = role === "researcher" || role === "reviewer" || role === "admin";
  return useQuery({
    queryKey: ["sources", "searchable", role],
    queryFn: () =>
      queryCollection<Source>(COLLECTIONS.sources, [
        ...(isResearcher ? [] : [where("verificationStatus", "==", "verified")]),
        orderBy("title"),
      ]),
  });
}

export function useSource(id: string | undefined) {
  return useQuery({
    queryKey: ["source", id],
    queryFn: () => getDocById<Source>(COLLECTIONS.sources, id as string),
    enabled: Boolean(id),
  });
}

export function useCreateSource(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Source, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
      const id = await createDoc(COLLECTIONS.sources, { ...data, createdBy: actorId });
      await writeAuditLog({ actorId, action: "create", entityType: "source", entityId: id, after: data });
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sources"] }),
  });
}
