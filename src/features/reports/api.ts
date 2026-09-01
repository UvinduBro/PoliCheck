import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  COLLECTIONS,
  createDoc,
  getDocById,
  orderBy,
  queryCollection,
  updateDocById,
  where,
} from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type { ResearchReport } from "@/types";

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => getDocById<ResearchReport>(COLLECTIONS.reports, id as string),
    enabled: Boolean(id),
  });
}

export function useLatestReportForPolitician(politicianId: string | undefined) {
  return useQuery({
    queryKey: ["reports", "byPolitician", politicianId],
    queryFn: async () => {
      const reports = await queryCollection<ResearchReport>(COLLECTIONS.reports, [
        where("politicianId", "==", politicianId),
        orderBy("createdAt", "desc"),
      ]);
      return reports[0] ?? null;
    },
    enabled: Boolean(politicianId),
  });
}

export function useCreateReport(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<ResearchReport, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
      const id = await createDoc(COLLECTIONS.reports, { ...data, createdBy: actorId });
      await writeAuditLog({ actorId, action: "create", entityType: "report", entityId: id, after: { title: data.title } });
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });
}

export function usePublishReport(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ResearchReport["status"] }) => {
      await updateDocById(COLLECTIONS.reports, id, {
        status,
        reviewedBy: actorId,
        ...(status === "published" ? { publishedAt: new Date() } : {}),
      });
      await writeAuditLog({ actorId, action: `status:${status}`, entityType: "report", entityId: id });
    },
    onSuccess: (_d, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["report", variables.id] });
    },
  });
}
