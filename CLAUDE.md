# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server at http://localhost:3000/kravbot
npm run build      # Production build (standalone output)
npm start          # Production server
npm run lint       # ESLint
docker compose up  # Docker dev at http://localhost:3001/kravbot
```

No test framework is configured.

## Architecture

KravBot is a KSF (Krav på IT-säkerhetsförmågor) test case generator. Users describe their IT system, Claude AI analyzes it against the Swedish defense security framework, and generates structured requirements with actions and verifications.

**Multi-step wizard flow:**
1. `SystemDescriptionForm` — user describes system (tech, location, roles, network, security level G/U/H)
2. `POST /api/questions` — Claude Haiku generates 3-5 clarifying questions
3. `FollowUpForm` — user optionally answers questions
4. `POST /api/generate` — Claude Sonnet streams full KSF requirement analysis (12k max tokens)
5. `TestCasesPanel` + `RequirementCard` — displays results with markdown export

**State orchestration** lives in `components/requirements-workspace.tsx` — it manages the step state machine and streaming.

**Prompt engineering** lives in `lib/prompts.ts` — contains the KSF domain expertise system prompt, user prompt builder, and question prompt builder.

## Key Constraints

- **basePath is `/kravbot`** — all client-side fetches must use `/kravbot/api/...`, not `/api/...`
- **AWS Bedrock, not direct Anthropic API** — uses `@anthropic-ai/bedrock-sdk` with inference profile `us.anthropic.claude-sonnet-4-6` (not `anthropic.claude-sonnet-4-6`)
- **`serverExternalPackages`** in `next.config.ts` must include both `@anthropic-ai/bedrock-sdk` and `@anthropic-ai/sdk` to avoid Turbopack bundling issues
- **AWS credentials required** — either via `~/.aws/credentials` or environment variables. Docker mounts `~/.aws` read-only
- **All UI text is in Swedish**
- **Streaming JSON** — the generate endpoint streams the response; the client accumulates chunks before parsing
