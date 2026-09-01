import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { COLLECTIONS, createDoc, getDocById, orderBy, queryCollection } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type { Source } from "@/types";

export function useSources() {
  return useQuery({
    queryKey: ["sources", "all"],
    queryFn: () => queryCollection<Source>(COLLECTIONS.sources, [orderBy("title")]),
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
