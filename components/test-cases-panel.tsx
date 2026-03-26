"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RequirementCard } from "@/components/requirement-card";
import { ExportButton } from "@/components/export-button";
import type { GenerationOutput, IdentifiedRequirement, RequirementTier } from "@/lib/types";

interface Props {
  output: GenerationOutput | null;
  isGenerating: boolean;
  streamingText: string;
}

const levelLabel = { G: "Grund", U: "Utökad", H: "Hög", unknown: "Okänd" };

export function TestCasesPanel({ output, isGenerating, streamingText }: Props) {
  if (!isGenerating && !output) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-3 text-muted-foreground">
        <div className="text-4xl">🔍</div>
        <p className="font-medium">Ingen analys genererad ännu</p>
        <p className="text-sm max-w-xs">
          Beskriv ert system i formuläret och välj säkerhetsnivå, sedan klickar du &quot;Analysera system&quot;.
        </p>
      </div>
    );
  }

  if (isGenerating && !output) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="animate-pulse">Analyserar system och identifierar KSF-krav...</span>
          {streamingText && (
            <Badge variant="outline" className="text-xs font-mono">
              {streamingText.length} tecken
            </Badge>
          )}
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border p-6 space-y-3">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        ))}
      </div>
    );
  }

  if (!output) return null;

  const tierOrder: RequirementTier[] = ["Kritisk", "Rekommenderad", "Ej tillämpbar"];
  const tierLabel: Record<RequirementTier, string> = {
    Kritisk: "Kritiska krav",
    Rekommenderad: "Rekommenderade krav",
    "Ej tillämpbar": "Ej tillämpbara krav",
  };
  const tierBadgeVariant: Record<RequirementTier, "red" | "amber" | "outline"> = {
    Kritisk: "red",
    Rekommenderad: "amber",
    "Ej tillämpbar": "outline",
  };

  const grouped = tierOrder.reduce(
    (acc, tier) => {
      acc[tier] = output.requirements.filter((r) => r.tier === tier);
      return acc;
    },
    {} as Record<RequirementTier, IdentifiedRequirement[]>,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">Certifieringsvägledning</span>
            <Badge variant="outline">
              Nivå {output.level} — {levelLabel[output.level]}
            </Badge>
            <Badge variant="red">{grouped["Kritisk"].length} kritiska</Badge>
            <Badge variant="amber">{grouped["Rekommenderad"].length} rekommenderade</Badge>
            <Badge variant="outline">{grouped["Ej tillämpbar"].length} ej tillämpbara</Badge>
          </div>
          {output.systemSummary && (
            <p className="text-sm text-muted-foreground max-w-prose">
              {output.systemSummary}
            </p>
          )}
        </div>
        <ExportButton output={output} />
      </div>

      {/* Requirements grouped by tier */}
      {tierOrder.map((tier) => {
        const reqs = grouped[tier];
        if (reqs.length === 0) return null;
        return (
          <TierSection key={tier} label={tierLabel[tier]} badgeVariant={tierBadgeVariant[tier]} count={reqs.length} defaultOpen={tier !== "Ej tillämpbar"}>
            {reqs.map((req) => (
              <RequirementCard key={req.ksfId} requirement={req} />
            ))}
          </TierSection>
        );
      })}
    </div>
  );
}

function TierSection({
  label,
  badgeVariant,
  count,
  defaultOpen,
  children,
}: {
  label: string;
  badgeVariant: "red" | "amber" | "outline";
  count: number;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
      >
        <span className="text-sm">{open ? "▼" : "▶"}</span>
        <h3 className="text-base font-semibold">{label}</h3>
        <Badge variant={badgeVariant}>{count}</Badge>
      </button>
      {open && <div className="space-y-4">{children}</div>}
    </div>
  );
}
