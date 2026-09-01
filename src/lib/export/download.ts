export function triggerDownload(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function casesToCsv(rows: { caseName: string; court?: string; legalStage: string; currentStatus: string }[]): string {
  const header = ["Case Name", "Court", "Legal Stage", "Current Status"];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push([row.caseName, row.court ?? "", row.legalStage, row.currentStatus].map(escape).join(","));
  }
  return lines.join("\n");
}
