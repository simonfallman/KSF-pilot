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
  const [technology, setTechnology] = useState(initialValues?.technology ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [roles, setRoles] = useState(initialValues?.roles ?? "");
  const [network, setNetwork] = useState(initialValues?.network ?? "");
  const [level, setLevel] = useState<KsfLevel>(initialValues?.level ?? "G");

  const canSubmit =
    technology.trim().length > 20 &&
    location.trim().length > 5 &&
    roles.trim().length > 5 &&
    !isLoading;

  function handleSubmit() {
    if (!canSubmit) return;
    onGenerate({ technology, location, roles, network: network || undefined, level });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="technology">Teknik och programvara *</Label>
        <Textarea
          id="technology"
          placeholder="Windows Server 2022, IIS, Active Directory, SQL Server 2019..."
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          className="min-h-[90px] resize-y text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lokaler och fysisk miljö *</Label>
        <Textarea
          id="location"
          placeholder="On-prem i låst serverrum, Tier 2-datacenter, fysisk åtkomstkontroll..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="min-h-[70px] resize-y text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="roles">Roller och driftorganisation *</Label>
        <Textarea
          id="roles"
          placeholder="Vanliga användare (50 st), driftadmins (3 st), säkloggadmin (1 st)..."
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
          className="min-h-[70px] resize-y text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="network">Nätverkstopologi (valfritt)</Label>
        <Textarea
          id="network"
          placeholder="Kopplat till internet via brandvägg, DMZ för webbserver..."
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="min-h-[60px] resize-y text-sm"
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
