import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { COLLECTIONS, createDoc, publicationConstraint, queryCollection } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type { Investigation, UserRole } from "@/types";

/** Every investigation visible to `role` — powers the global Investigations page and search. */
export function useAllInvestigations(role: UserRole | undefined) {
  return useQuery({
    queryKey: ["investigations", "all", role],
    queryFn: () => queryCollection<Investigation>(COLLECTIONS.investigations, publicationConstraint(role)),
  });
}

export function useCreateInvestigation(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Investigation, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
      const id = await createDoc(COLLECTIONS.investigations, { ...data, createdBy: actorId });
      await writeAuditLog({ actorId, action: "create", entityType: "investigation", entityId: id, after: data });
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["investigations"] }),
  });
}
