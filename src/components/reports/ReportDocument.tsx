import { isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { extractTableOfContents, slugifyHeading } from "@/lib/reports/tableOfContents";

function flattenToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenToText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return flattenToText(props.children);
  }
  return "";
}

export function ReportDocument({
  eyebrow,
  title,
  badges,
  meta,
  limitations,
  markdown,
}: {
  eyebrow?: string;
  title: string;
  badges?: ReactNode;
  meta?: ReactNode;
  limitations?: string;
  markdown: string;
}) {
  const toc = extractTableOfContents(markdown);

  return (
    <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-10">
      {toc.length > 0 && (
        <nav aria-label="On this page" className="hidden lg:sticky lg:top-[81px] lg:block">
          <p className="eyebrow">On this page</p>
          <ol className="mt-3 max-h-[calc(100vh-140px)] space-y-1 overflow-y-auto border-l border-line pl-3 text-sm">
            {toc.map((entry) => (
              <li key={entry.id}>
                <a
                  href={`#${entry.id}`}
                  className="block truncate py-0.5 text-ink-muted transition-colors hover:text-accent"
                >
                  {entry.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <article className="min-w-0">
        <div className="border-b border-line pb-5">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
            <h1 className="font-serif-report text-2xl font-semibold leading-tight text-ink sm:text-3xl">{title}</h1>
            {badges && <div className="flex shrink-0 items-center gap-2">{badges}</div>}
          </div>
          {meta && <p className="mt-2 text-xs text-ink-faint">{meta}</p>}
        </div>

        {limitations && (
          <div className="mt-5 rounded-lg border border-status-pending/30 bg-status-pending-bg px-4 py-3 text-sm text-ink">
            <span className="font-semibold text-status-pending">Limitations: </span>
            {limitations}
          </div>
        )}

        {toc.length > 0 && (
          <nav aria-label="On this page" className="mt-5 lg:hidden">
            <details className="card p-3">
              <summary className="cursor-pointer text-sm font-medium text-ink">On this page</summary>
              <ol className="mt-2 space-y-1 border-l border-line pl-3 text-sm">
                {toc.map((entry) => (
                  <li key={entry.id}>
                    <a href={`#${entry.id}`} className="block py-0.5 text-ink-muted hover:text-accent">
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          </nav>
        )}

        <div className="prose prose-sm mt-6 max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:text-ink prose-p:leading-relaxed prose-p:text-ink prose-li:text-ink prose-strong:text-ink prose-a:text-accent prose-blockquote:border-line-strong prose-blockquote:text-ink-muted prose-hr:border-line prose-th:text-ink prose-td:text-ink-muted dark:prose-invert">
          <ReactMarkdown
            components={{
              h1: () => null,
              h2: ({ children }) => (
                <h2 id={slugifyHeading(flattenToText(children))} className="scroll-mt-24">
                  {children}
                </h2>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
