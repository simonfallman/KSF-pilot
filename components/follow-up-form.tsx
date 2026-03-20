"use client";

import { useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  questions: string[];
  onSubmit: (answers: Record<number, string>) => void;
  onBack: () => void;
}

export function FollowUpForm({ questions, onSubmit, onBack }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  function setAnswer(index: number, value: string) {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">
          Besvara frågorna nedan för en mer precis analys. Alla svar är valfria.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((question, i) => (
          <div key={i} className="space-y-1.5">
            <Label htmlFor={`q-${i}`} className="text-sm leading-snug">
              {question}
            </Label>
            <Input
              id={`q-${i}`}
              placeholder="Svar (valfritt)"
              value={answers[i] ?? ""}
              onChange={(e) => setAnswer(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="ghost" onClick={onBack} className="flex-none">
          <ChevronLeft className="h-4 w-4" />
          Tillbaka
        </Button>
        <Button onClick={() => onSubmit(answers)} className="flex-1" size="lg">
          <Sparkles className="h-4 w-4" />
          Analysera system →
        </Button>
      </div>
    </div>
  );
}
