"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { IdentifiedRequirement, RequirementTier } from "@/lib/types";

const tierVariant: Record<RequirementTier, "red" | "amber" | "outline"> = {
  Kritisk: "red",
  Rekommenderad: "amber",
  "Ej tillämpbar": "outline",
};

interface Props {
  requirement: IdentifiedRequirement;
}

function SectionToggle({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 hover:text-foreground transition-colors"
      >
        <span>{open ? "▼" : "▶"}</span>
        {title}
      </button>
      {open && children}
    </div>
  );
}

export function RequirementCard({ requirement: req }: Props) {
  return (
    <Card className="text-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2 flex-wrap">
          <Badge variant="outline" className="font-mono text-xs">
            {req.ksfId}
          </Badge>
          <Badge variant={req.ksfCategory === "SF" ? "blue" : "amber"}>
            {req.ksfCategory}
          </Badge>
          <Badge variant={tierVariant[req.tier]}>
            {req.tier}
          </Badge>
          <span className="font-semibold leading-snug">{req.title}</span>
        </div>
        {req.rationale && (
          <p className="text-xs text-muted-foreground mt-1">{req.rationale}</p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <SectionToggle title="Vad KSF kräver">
          <p className="text-sm">{req.ksfRequirement}</p>
        </SectionToggle>

        {req.tier !== "Ej tillämpbar" && (
          <>
            <Separator />

            <SectionToggle title={`Vad ni behöver ha på plats (${req.actions.length})`}>
              <ol className="space-y-1.5">
                {req.actions.map((action) => (
                  <li key={action.id} className="flex gap-2.5">
                    <span className="font-semibold text-muted-foreground shrink-0 w-4 text-right">
                      {action.id}.
                    </span>
                    <span>{action.description}</span>
                  </li>
                ))}
              </ol>
            </SectionToggle>

            <Separator />

            <SectionToggle title={`Hur ni visar att ni uppfyller det (${req.verifications.length})`}>
              <ol className="space-y-1.5">
                {req.verifications.map((step) => (
                  <li key={step.id} className="flex gap-2.5">
                    <span className="font-semibold text-muted-foreground shrink-0 w-4 text-right">
                      {step.id}.
                    </span>
                    <span>{step.description}</span>
                  </li>
                ))}
              </ol>
            </SectionToggle>
          </>
        )}
      </CardContent>
    </Card>
  );
}
