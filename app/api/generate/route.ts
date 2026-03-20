import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import { SYSTEM_PROMPT, buildSystemPrompt } from "@/lib/prompts";
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

    const stream = client.messages.stream({
      model: "us.anthropic.claude-sonnet-4-6",
      max_tokens: 12000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildSystemPrompt({ description: systemDescription, level }) }],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Generate error:", err);
    return new Response(
      JSON.stringify({ error: "Fel vid generering av testfall" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
