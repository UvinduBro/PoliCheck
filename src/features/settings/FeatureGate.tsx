import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { useFeatureFlags } from "./api";
import { FEATURE_FLAG_LABELS, type FeatureFlagKey } from "@/constants/featureFlags";

export function useFeatureEnabled(flag: FeatureFlagKey): boolean {
  const { flags } = useFeatureFlags();
  return flags[flag];
}

/** Route-level guard: renders children only when `flag` is on, otherwise a disabled-state page. */
export function FeatureGate({ flag, children }: { flag: FeatureFlagKey; children: ReactNode }) {
  const enabled = useFeatureEnabled(flag);
  if (enabled) return <>{children}</>;

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
        <Lock size={20} aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-lg font-semibold text-ink">{FEATURE_FLAG_LABELS[flag]} is currently disabled</h1>
      <p className="mt-2 text-sm text-ink-muted">
        An administrator has turned this feature off for now. It can be re-enabled from the Admin dashboard.
      </p>
    </div>
  );
}
