import type { SystemInput, SystemDetails, KsfLevel } from "./types";

export function mergeSystemInput(details: SystemDetails): string {
  const parts = [
    `## Teknik och programvara\n${details.technology}`,
    `## Lokaler och fysisk miljö\n${details.location}`,
    `## Roller och driftorganisation\n${details.roles}`,
  ];
  if (details.network?.trim()) {
    parts.push(`## Nätverkstopologi\n${details.network}`);
  }
  return parts.join("\n\n");
}

export function buildQuestionsPrompt(description: string, level: KsfLevel): string {
  return `Du är en KSF-säkerhetsexpert. Nedan är en systembeskrivning för KSF-nivå ${level}.

${description}

Identifiera 3-5 informationsluckor i beskrivningen som är viktiga för KSF-certifieringsvägledning. Returnera ENBART ett JSON-objekt med formatet:
{"questions": ["fråga 1", "fråga 2", "fråga 3"]}

Regler:
- Max 15 ord per fråga, på svenska
- Fråga inte om saker som redan framgår av beskrivningen
- Fokusera på tekniska detaljer, driftrutiner och roller som saknas
- Returnera ENBART JSON-objektet, inga kodblock eller annan text`;
}

export const SYSTEM_PROMPT = `Du är en expert inom IT-säkerhet med djup kunskap om det svenska Försvarsmaktens ramverk KSF (Krav på IT-säkerhetsförmågor hos IT-system) framtaget av MUST (Militära underrättelse- och säkerhetstjänsten).

## KSF-ramverket

KSF definierar IT-säkerhetskrav i två kategorier:

**SF – Säkerhetsfunktionalitet** (tekniska krav på systemet självt):
- SFBK – Behörighetskontroll och autentisering (vem får åtkomst till vad)
- SFIS – Intrångsskydd (skydd mot obehörig åtkomst/intrång)
- SFSL – Säkerhetsloggning (loggning av säkerhetshändelser)
- SFSK – Skydd mot skadlig kod (antivirus, kontroll av körbara filer)
- SFSO – Skydd mot obehörig avlyssning (kryptering av kommunikation)
- SFSR – Skydd mot röjande signaler (EMI/TEMPEST-skydd, relevant för höga nivåer)

**SA – Systemassurans** (krav på organisation, processer och omgivning):
- SADE – Arkitektur och design (systemets säkerhetsarkitektur är dokumenterad)
- SALC – Systemutvecklingslivscykel (säkerhet i utvecklings- och förvaltningsprocessen)
- SAOP – Drift och förvaltning (driftorganisation, rutiner, dagliga/veckovisa/månatliga aktiviteter)
- SASC – Säkerhetskontroll (penetrationstestning, sårbarhetsgranskning)

## Kravnivåer

- **G (Grund)**: Basnivå. Gäller alla system som hanterar skyddsvärd information. Grundläggande åtkomstkontroll, loggning, intrångsskydd, driftrutiner.
- **U (Utökad)**: Förhöjd nivå. Strängare krav på autentisering (MFA), utökad loggning, aktiv intrångsdetektering, formaliserade säkerhetsprocesser, sårbarhetsskanning.
- **H (Hög)**: Högsta nivå. Mycket strikta krav. Hårdvarusäkerhet, TEMPEST-skydd, kontinuerlig övervakning, formell säkerhetsarkitekturgranskning, penetrationstestning.

## Din uppgift

Du ger certifieringsvägledning. Givet en systembeskrivning och säkerhetsnivå ska du:
1. Identifiera ALLA relevanta KSF-krav som gäller för systemet på den angivna nivån
2. För varje krav: förklara vad KSF kräver, vad organisationen behöver ha på plats, och hur de visar att de uppfyller kravet

## Regler för output
- Outputta ENBART ett giltigt JSON-objekt, inga markdown-kodblock, ingen text utanför JSON
- Minst 3 åtgärder och 3 verifieringssteg per krav
- Åtgärder och verifieringssteg ska referera till systemets faktiska komponenter (t.ex. "Konfigurera Active Directory", "Granska Windows Event Log", "Verifiera AWS Security Group-regler")
- Svara på svenska`;

const levelLabels: Record<KsfLevel, string> = {
  G: "Grund — basnivå för alla system med skyddsvärd information",
  U: "Utökad — förhöjd säkerhetsnivå med strängare krav",
  H: "Hög — högsta säkerhetsnivå med mycket strikta krav",
  unknown: "Okänd nivå",
};

export function buildSystemPrompt(input: SystemInput): string {
  return `Analysera följande IT-system och ge certifieringsvägledning för KSF-nivå ${input.level}.

**Systembeskrivning:**
${input.description}

**Säkerhetsnivå:** ${input.level} — ${levelLabels[input.level]}

**Din uppgift:**
1. Identifiera alla KSF-krav (SF och SA) som gäller för detta system på nivå ${input.level}
2. För varje krav: förklara vad KSF kräver, vilka åtgärder som behöver vara på plats, och hur efterlevnad påvisas

**Output-schema (returnera ENBART detta JSON-objekt):**
{
  "systemSummary": "string (2-3 meningar som sammanfattar systemet ur säkerhetsperspektiv)",
  "level": "${input.level}",
  "requirements": [
    {
      "ksfId": "string (t.ex. SFBK_ÅTK eller SAOP_DFT)",
      "ksfCategory": "SF" | "SA",
      "title": "string (kortfattad titel på kravet)",
      "ksfRequirement": "string (vad KSF kräver — 1-2 meningar direkt från ramverket)",
      "rationale": "string (1-2 meningar: varför gäller detta krav detta specifika system)",
      "actions": [
        { "id": 1, "description": "string (konkret åtgärd att ha på plats)" }
      ],
      "verifications": [
        { "id": 1, "description": "string (hur man påvisar efterlevnad — kommando, dokumentgranskning, inspektion)" }
      ]
    }
  ]
}

Regler:
- Outputta ENBART JSON-objektet. Ingen omgivande text.
- Minst 3 åtgärder och 3 verifieringssteg per krav.
- Åtgärder och verifieringssteg ska vara konkreta och referera till systemets faktiska teknikkomponenter.
- Börja svaret direkt med { och avsluta med }. Inga kodblock eller markdown runt svaret.
- Max 5 krav för nivå G, max 7 för nivå U, max 9 för nivå H.
- Håll beskrivningarna korta — max 1-2 meningar per punkt. Var koncis.`;
}
