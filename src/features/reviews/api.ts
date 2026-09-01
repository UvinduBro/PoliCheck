import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { COLLECTIONS, queryCollection, updateDocById, where } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import type {
  Claim,
  CorrectionRequest,
  CorrectionRequestStatus,
  Investigation,
  LegalCase,
  LegalEvent,
  Politician,
  PublicationStatus,
  ReviewStatus,
} from "@/types";

export function usePendingReviewItems() {
  const politicians = useQuery({
    queryKey: ["review", "politicians"],
    queryFn: () => queryCollection<Politician>(COLLECTIONS.politicians, [where("publicationStatus", "==", "review")]),
  });
  const cases = useQuery({
    queryKey: ["review", "cases"],
    queryFn: () => queryCollection<LegalCase>(COLLECTIONS.cases, [where("publicationStatus", "==", "review")]),
  });
  const investigations = useQuery({
    queryKey: ["review", "investigations"],
    queryFn: () => queryCollection<Investigation>(COLLECTIONS.investigations, [where("publicationStatus", "==", "review")]),
  });
  const events = useQuery({
    queryKey: ["review", "events"],
    queryFn: () => queryCollection<LegalEvent>(COLLECTIONS.legalEvents, [where("publicationStatus", "==", "review")]),
  });
  const claims = useQuery({
    queryKey: ["review", "claims"],
    queryFn: () => queryCollection<Claim>(COLLECTIONS.claims, [where("reviewStatus", "==", "pending_review")]),
  });
  const correctionRequests = useQuery({
    queryKey: ["review", "correctionRequests"],
    queryFn: () => queryCollection<CorrectionRequest>(COLLECTIONS.correctionRequests, [where("status", "==", "open")]),
  });

  return {
    politicians: politicians.data ?? [],
    cases: cases.data ?? [],
    investigations: investigations.data ?? [],
    events: events.data ?? [],
    claims: claims.data ?? [],
    correctionRequests: correctionRequests.data ?? [],
    isLoading:
      politicians.isLoading ||
      cases.isLoading ||
      investigations.isLoading ||
      events.isLoading ||
      claims.isLoading ||
      correctionRequests.isLoading,
  };
}

export function useResolveCorrectionRequest(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CorrectionRequestStatus }) => {
      await updateDocById(COLLECTIONS.correctionRequests, id, { status, reviewedBy: actorId });
      await writeAuditLog({ actorId, action: `status:${status}`, entityType: "correctionRequest", entityId: id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["review"] }),
  });
}

const ENTITY_COLLECTIONS: Record<string, string> = {
  politician: COLLECTIONS.politicians,
  case: COLLECTIONS.cases,
  investigation: COLLECTIONS.investigations,
  legalEvent: COLLECTIONS.legalEvents,
};

export function useSetPublicationStatus(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      entityType,
      id,
      status,
    }: {
      entityType: keyof typeof ENTITY_COLLECTIONS;
      id: string;
      status: PublicationStatus;
    }) => {
      await updateDocById(ENTITY_COLLECTIONS[entityType], id, { publicationStatus: status, reviewedBy: actorId });
      await writeAuditLog({ actorId, action: `publicationStatus:${status}`, entityType, entityId: id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["review"] }),
  });
}

export function useSetClaimReviewStatus(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReviewStatus }) => {
      await updateDocById(COLLECTIONS.claims, id, { reviewStatus: status, reviewedBy: actorId });
      await writeAuditLog({ actorId, action: `reviewStatus:${status}`, entityType: "claim", entityId: id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["review"] }),
  });
}
