import { useNomadStore } from "@/store";
import { pt } from "./pt";
import { en } from "./en";
import { SupportedLocale, TranslationDictionary } from "./types";

export * from "./types";
export { pt, en };

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  pt,
  en,
};

export function useTranslation() {
  const locale = useNomadStore((s) => s.locale || "pt") as SupportedLocale;
  const setLocale = useNomadStore((s) => s.setLocale);

  const t = translations[locale] || translations.pt;

  return {
    t,
    locale,
    setLocale,
    isPt: locale === "pt",
    isEn: locale === "en",
  };
}

