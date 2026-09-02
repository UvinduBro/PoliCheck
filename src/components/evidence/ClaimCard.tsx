import { evidenceTierIcon, EvidenceBadge } from "./EvidenceBadge";
import { TranslatedText } from "@/components/content/TranslatedText";
import type { Claim } from "@/types";

export function ClaimCard({ claim, sourceCount }: { claim: Claim; sourceCount: number }) {
  const Icon = evidenceTierIcon(claim.classification);

  return (
    <li className="card flex gap-3 p-4">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-2 text-ink-muted">
        <Icon size={16} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <EvidenceBadge classification={claim.classification} />
        <TranslatedText text={claim.text} className="mt-2 text-sm leading-relaxed text-ink" />
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
          {claim.claimant && <span>Claimant: {claim.claimant}</span>}
          <span>
            {sourceCount} source{sourceCount === 1 ? "" : "s"}
          </span>
          {claim.currentStatus && <span>{claim.currentStatus}</span>}
        </div>
        {claim.response && (
          <div className="mt-2 rounded-md bg-surface-2 px-3 py-2 text-xs text-ink-muted">
            <span className="font-medium text-ink">Response: </span>
            <TranslatedText text={claim.response} className="inline" />
          </div>
        )}
      </div>
    </li>
  );
}
