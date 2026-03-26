export type KsfCategory = "SF" | "SA";
export type KsfLevel = "G" | "U" | "H" | "unknown";
export type RequirementTier = "Kritisk" | "Rekommenderad" | "Ej tillämpbar";

export interface SystemDetails {
  description: string;
  level: KsfLevel;
}

export interface QuestionsOutput {
  questions: string[];
}

export interface SystemInput {
  description: string;
  level: KsfLevel;
}

export interface RequirementAction {
  id: number;
  description: string;
}

export interface VerificationStep {
  id: number;
  description: string;
}

export interface IdentifiedRequirement {
  ksfId: string;
  ksfCategory: KsfCategory;
  tier: RequirementTier;
  title: string;
  ksfRequirement: string;
  rationale: string;
  actions: RequirementAction[];
  verifications: VerificationStep[];
}

export interface GenerationOutput {
  systemSummary: string;
  level: KsfLevel;
  requirements: IdentifiedRequirement[];
}
