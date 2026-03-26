import type { GenerationOutput, RequirementTier, IdentifiedRequirement } from "./types";

const levelLabel = { G: "Grund", U: "Utökad", H: "Hög", unknown: "Okänd" };

const tierSectionLabel: Record<RequirementTier, string> = {
  Kritisk: "Kritiska krav",
  Rekommenderad: "Rekommenderade krav",
  "Ej tillämpbar": "Ej tillämpbara krav",
};

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

  const tierOrder: RequirementTier[] = ["Kritisk", "Rekommenderad", "Ej tillämpbar"];

  for (const tier of tierOrder) {
    const reqs = output.requirements.filter((r) => r.tier === tier);
    if (reqs.length === 0) continue;

    lines.push(`## ${tierSectionLabel[tier]}`, "");

    for (const req of reqs) {
      const categoryLabel = req.ksfCategory === "SF"
        ? "Säkerhetsfunktionalitet"
        : "Systemassurans";

      lines.push(
        `### ${req.ksfId} — ${req.title}`,
        "",
        `**Kategori:** ${categoryLabel}`,
        "",
        `**Vad KSF kräver:** ${req.ksfRequirement}`,
        "",
        `**Motivering:** ${req.rationale}`,
        "",
      );

      if (tier !== "Ej tillämpbar") {
        lines.push("#### Vad ni behöver ha på plats", "");
        for (const action of req.actions) {
          lines.push(`${action.id}. ${action.description}`);
        }
        lines.push("", "#### Hur ni visar att ni uppfyller det", "");
        for (const step of req.verifications) {
          lines.push(`${step.id}. ${step.description}`);
        }
        lines.push("");
      }

      lines.push("---", "");
    }
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
