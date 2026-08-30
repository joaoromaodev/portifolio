import { en, type Dictionary } from "./dictionaries/en";
import { pt } from "./dictionaries/pt";
import type { Locale } from "./config";

const DICTIONARIES: Record<Locale, Dictionary> = { en, pt };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary };
export * from "./config";
