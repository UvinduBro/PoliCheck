import DOMPurify from "dompurify";

/** Sanitizes rendered Markdown/HTML (report content, source summaries, biographies) before it hits the DOM. */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "a", "b", "i", "em", "strong", "p", "br", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "blockquote", "code", "pre", "table",
      "thead", "tbody", "tr", "th", "td", "hr", "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

export function sanitizePlainText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
