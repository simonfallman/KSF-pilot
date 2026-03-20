"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToMarkdown, downloadMarkdown } from "@/lib/export-markdown";
import type { GenerationOutput } from "@/lib/types";

interface Props {
  output: GenerationOutput;
}

export function ExportButton({ output }: Props) {
  function handleExport() {
    const content = exportToMarkdown(output);
    const date = new Date().toISOString().split("T")[0];
    downloadMarkdown(content, `ksf-testfall-${output.level}-${date}.md`);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="h-4 w-4" />
      Exportera Markdown
    </Button>
  );
}
