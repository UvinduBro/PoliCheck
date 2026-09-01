import { useMutation, useQueryClient } from "@tanstack/react-query";
import { COLLECTIONS, createDoc } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type { Investigation } from "@/types";

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
