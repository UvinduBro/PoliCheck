import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { COLLECTIONS, getDocById, setDocById } from "@/lib/firebase/firestore";
import { writeAuditLog } from "@/lib/firebase/auditLog";
import { DEFAULT_FEATURE_FLAGS, type FeatureFlags } from "@/constants/featureFlags";

const FEATURE_FLAGS_DOC_ID = "featureFlags";

/**
 * Reads the admin-controlled feature-flag doc. Fails open to the defaults (everything but the
 * initial-launch core stays off) whenever Firestore is unreachable or unconfigured, rather than
 * surfacing an error state for what is purely a navigation-gating concern.
 */
export function useFeatureFlags() {
  const query = useQuery({
    queryKey: ["settings", "featureFlags"],
    queryFn: async (): Promise<FeatureFlags> => {
      try {
        const doc = await getDocById<Partial<FeatureFlags>>(COLLECTIONS.settings, FEATURE_FLAGS_DOC_ID);
        return { ...DEFAULT_FEATURE_FLAGS, ...doc };
      } catch {
        return DEFAULT_FEATURE_FLAGS;
      }
    },
    staleTime: 60_000,
  });

  return { flags: query.data ?? DEFAULT_FEATURE_FLAGS, isLoading: query.isLoading };
}

export function useUpdateFeatureFlags(actorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (flags: FeatureFlags) => {
      await setDocById(COLLECTIONS.settings, FEATURE_FLAGS_DOC_ID, flags);
      await writeAuditLog({ actorId, action: "update", entityType: "featureFlags", entityId: FEATURE_FLAGS_DOC_ID, after: flags });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings", "featureFlags"] }),
  });
}
