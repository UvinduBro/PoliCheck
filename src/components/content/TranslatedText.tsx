import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate/translateText";

/**
 * Wraps a block of researcher-submitted text (biography, case description, claim text) with
 * an on-demand machine translation into the current UI language. The original English text
 * (the source-cited version) is always one click away via "View original" — a translation
 * error or an imprecise machine rendering must never look as authoritative as the source.
 */
export function TranslatedText({ text, className }: { text: string; className?: string }) {
  const { t, i18n } = useTranslation();
  const [showOriginal, setShowOriginal] = useState(false);
  const targetLang = i18n.language;
  const needsTranslation = targetLang === "si" || targetLang === "ta";
  const shouldFetch = needsTranslation && !showOriginal;

  const { data: translated, isLoading, isError } = useQuery({
    queryKey: ["translate-content", text, targetLang],
    queryFn: () => translateText(text, targetLang as "si" | "ta"),
    enabled: shouldFetch,
    staleTime: Infinity,
    retry: 1,
  });

  const displayingOriginal = !needsTranslation || showOriginal || isError || !translated;

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap">{displayingOriginal ? text : translated}</p>
      {needsTranslation && !isError && (
        <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-faint">
          {shouldFetch && isLoading ? (
            <span>{t("translate.translating")}</span>
          ) : (
            <>
              {!displayingOriginal && <span>{t("translate.machineTranslated")}</span>}
              <button
                type="button"
                className="text-accent hover:underline"
                onClick={() => setShowOriginal((v) => !v)}
              >
                {displayingOriginal ? t("translate.viewTranslation") : t("translate.viewOriginal")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
