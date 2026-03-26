"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { KsfLevel, SystemDetails } from "@/lib/types";

interface Props {
  onGenerate: (details: SystemDetails) => void;
  isLoading: boolean;
  initialValues?: SystemDetails;
}

export function SystemDescriptionForm({ onGenerate, isLoading, initialValues }: Props) {
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [level, setLevel] = useState<KsfLevel>(initialValues?.level ?? "G");

  const canSubmit = description.trim().length > 20 && !isLoading;

  function handleSubmit() {
    if (!canSubmit) return;
    onGenerate({ description, level });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Systembeskrivning *</Label>
        <Textarea
          id="description"
          placeholder="Beskriv ert IT-system: teknik och programvara, lokaler och fysisk miljö, roller och driftorganisation, nätverkstopologi..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[180px] resize-y text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Säkerhetsnivå (KSF)</Label>
        <Select value={level} onValueChange={(v) => setLevel(v as KsfLevel)}>
          <SelectTrigger id="level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="G">G — Grund (basnivå för alla system)</SelectItem>
            <SelectItem value="U">U — Utökad (förhöjd säkerhetsnivå)</SelectItem>
            <SelectItem value="H">H — Hög (högsta säkerhetsnivå)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {level === "G" && "Grundläggande krav: åtkomstkontroll, loggning, intrångsskydd, driftrutiner."}
          {level === "U" && "Utökade krav: MFA, aktiv intrångsdetektering, sårbarhetsskanning, formaliserade processer."}
          {level === "H" && "Högsta krav: hårdvarusäkerhet, TEMPEST, kontinuerlig övervakning, penetrationstestning."}
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full"
        size="lg"
      >
        <Sparkles className="h-4 w-4" />
        {isLoading ? "Hämtar följdfrågor..." : "Fortsätt →"}
      </Button>
    </div>
  );
}
