import type { GenerationOutput } from "./types";

const levelLabel = { G: "Grund", U: "Utökad", H: "Hög", unknown: "Okänd" };

export function exportToMarkdown(output: GenerationOutput): string {
  const lines: string[] = [
    "# KravBot — Certifieringsvägledning",
    "",
    `_Exporterat: ${new Date().toLocaleString("sv-SE")}_`,
    `_Säkerhetsnivå: ${levelLabel[output.level]}_`,
    "",
    "## Systemöversikt",
    "",
    output.systemSummary,
    "",
    "---",
    "",
  ];

  for (const req of output.requirements) {
    const categoryLabel = req.ksfCategory === "SF"
      ? "Säkerhetsfunktionalitet"
      : "Systemassurans";

    lines.push(
      `## ${req.ksfId} — ${req.title}`,
      "",
      `**Kategori:** ${categoryLabel}`,
      "",
      `**Vad KSF kräver:** ${req.ksfRequirement}`,
      "",
      `**Motivering:** ${req.rationale}`,
      "",
      "### Vad ni behöver ha på plats",
      "",
    );

    for (const action of req.actions) {
      lines.push(`${action.id}. ${action.description}`);
    }

    lines.push(
      "",
      "### Hur ni visar att ni uppfyller det",
      "",
    );

    for (const step of req.verifications) {
      lines.push(`${step.id}. ${step.description}`);
    }

    lines.push("", "---", "");
  }

  return lines.join("\n");
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
