"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SystemDescriptionForm } from "@/components/system-description-form";
import { FollowUpForm } from "@/components/follow-up-form";
import { TestCasesPanel } from "@/components/test-cases-panel";
import type { GenerationOutput, KsfLevel, SystemDetails } from "@/lib/types";

type Step =
  | { kind: "form"; savedDetails?: SystemDetails }
  | { kind: "questions"; details: SystemDetails; questions: string[] }
  | { kind: "results" };

export function RequirementsWorkspace() {
  const [step, setStep] = useState<Step>({ kind: "form" });
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);
  const [output, setOutput] = useState<GenerationOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleFormSubmit(details: SystemDetails) {
    setIsFetchingQuestions(true);
    setError(null);

    try {
      const response = await fetch("/kravbot/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemDescription: details.description, level: details.level }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Okänt fel");
      }

      const data = await response.json();
      setStep({ kind: "questions", details, questions: data.questions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fel vid hämtning av följdfrågor");
    } finally {
      setIsFetchingQuestions(false);
    }
  }

  async function handleQuestionsSubmit(answers: Record<number, string>) {
    if (step.kind !== "questions") return;

    const baseDescription = step.details.description;
    const answerLines = step.questions
      .map((q, i) => {
        const ans = answers[i]?.trim();
        return ans ? `- ${q}\n  Svar: ${ans}` : null;
      })
      .filter(Boolean);

    const mergedDescription =
      answerLines.length > 0
        ? `${baseDescription}\n\n## Kompletterande svar\n${answerLines.join("\n")}`
        : baseDescription;

    setStep({ kind: "results" });
    await generate(mergedDescription, step.details.level);
  }

  async function generate(description: string, level: KsfLevel) {
    if (isGenerating) return;

    setIsGenerating(true);
    setStreamingText("");
    setOutput(null);
    setError(null);

    try {
      const response = await fetch("/kravbot/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemDescription: description, level }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Okänt fel");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setStreamingText(buffer);
      }

      const cleaned = buffer
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();
      const parsed: GenerationOutput = JSON.parse(cleaned);
      setOutput(parsed);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Fel vid generering");
    } finally {
      setIsGenerating(false);
      setStreamingText("");
    }
  }

  function getLeftPanelTitle(): string {
    if (step.kind === "questions") return "Kompletterande frågor";
    if (step.kind === "results") return "Analys klar";
    return "Beskriv ert system";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
      {/* Left panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">{getLeftPanelTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {step.kind === "form" && (
              <SystemDescriptionForm
                onGenerate={handleFormSubmit}
                isLoading={isFetchingQuestions}
                initialValues={step.savedDetails}
              />
            )}
            {step.kind === "questions" && (
              <FollowUpForm
                questions={step.questions}
                onSubmit={handleQuestionsSubmit}
                onBack={() =>
                  setStep({ kind: "form", savedDetails: step.details })
                }
              />
            )}
            {step.kind === "results" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {isGenerating
                    ? "Analyserar system och genererar certifieringsvägledning..."
                    : "Analysen är klar. Granska kraven i panelen till höger."}
                </p>
                {!isGenerating && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep({ kind: "form" })}
                  >
                    Starta om
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div>
        <TestCasesPanel
          output={output}
          isGenerating={isGenerating}
          streamingText={streamingText}
        />
      </div>
    </div>
  );
}
