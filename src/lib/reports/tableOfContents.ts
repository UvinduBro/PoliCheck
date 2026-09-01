export interface TocEntry {
  id: string;
  text: string;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/** Extracts h2-level headings (report sections) from generated markdown for a sticky TOC. */
export function extractTableOfContents(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^##\s+(.*)$/.exec(line.trim());
    if (match) {
      const text = match[1].trim();
      entries.push({ id: slugifyHeading(text), text });
    }
  }
  return entries;
}
