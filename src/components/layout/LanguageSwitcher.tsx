import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { LANGUAGE_LABELS } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <label className="relative inline-flex h-10 shrink-0 items-center">
      <span className="sr-only">Language</span>
      <Languages
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-2.5 text-ink-muted"
      />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as (typeof languages)[number])}
        className="h-10 appearance-none rounded-md border border-transparent bg-transparent py-2 pl-8 pr-2 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {languages.map((code) => (
          <option key={code} value={code}>
            {LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
