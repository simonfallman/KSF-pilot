export type KsfCategory = "SF" | "SA";
export type KsfLevel = "G" | "U" | "H" | "unknown";

export interface SystemDetails {
  technology: string;
  location: string;
  roles: string;
  network?: string;
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
