import type { KsfCategory } from "./types";

export function getKsfCategory(ksfId: string): KsfCategory {
  return ksfId.toUpperCase().startsWith("SF") ? "SF" : "SA";
}

export function isValidKsfId(ksfId: string): boolean {
  return /^(SF|SA)[A-Z]{2}[_A-ZÅÄÖ]*(\.[A-Z0-9]+)?$/i.test(ksfId.trim());
}

export function formatKsfCategoryLabel(category: KsfCategory): string {
  return category === "SF"
    ? "Funktionellt säkerhetskrav"
    : "Assuranskrav";
}
