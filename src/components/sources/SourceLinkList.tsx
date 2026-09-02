import { ExternalLink, Link2 } from "lucide-react";

/** Plain-URL citations — the fallback citation mechanism used while the Sources library subsystem is disabled. */
export function SourceLinkList({ links }: { links: string[] }) {
  if (links.length === 0) return null;

  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link} className="card flex items-center gap-2 p-3 text-sm">
          <Link2 size={14} className="shrink-0 text-ink-faint" aria-hidden="true" />
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 flex-1 items-center gap-1 truncate text-ink hover:text-accent"
          >
            <span className="truncate">{link}</span>
            <ExternalLink size={12} className="shrink-0 text-ink-faint" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
