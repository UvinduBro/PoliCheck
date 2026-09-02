import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n/config";

const STORAGE_KEY = "politician-watch-lang";

/** Persists the chosen UI language and keeps <html lang> in sync for accessibility. */
export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || "en",
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback(
    (next: SupportedLanguage) => {
      void i18n.changeLanguage(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      setLanguageState(next);
    },
    [i18n],
  );

  return { language, setLanguage, languages: SUPPORTED_LANGUAGES };
}
