import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import { buildQuestionsPrompt } from "@/lib/prompts";
import type { KsfLevel } from "@/lib/types";

const client = new AnthropicBedrock({
  awsRegion: process.env.AWS_REGION || "us-east-1",
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const systemDescription: string = body.systemDescription;
    const level: KsfLevel = body.level || "G";

    if (!systemDescription?.trim()) {
      return new Response(JSON.stringify({ error: "Systembeskrivning saknas" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = buildQuestionsPrompt(systemDescription, level);

    const message = await client.messages.create({
      model: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Strip markdown code fences if present
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const questions: string[] = Array.isArray(parsed.questions)
      ? parsed.questions
      : [];

    return new Response(JSON.stringify({ questions }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Questions error:", err);
    return new Response(
      JSON.stringify({ error: "Fel vid generering av följdfrågor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
