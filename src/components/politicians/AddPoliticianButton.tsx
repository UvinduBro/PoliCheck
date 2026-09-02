import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AddPoliticianButton({ className }: { className: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);

  if (user) {
    return (
      <Link to="/politicians/new" className={className}>
        <Plus size={16} aria-hidden="true" />
        {t("politicians.addButton")}
      </Link>
    );
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setShowPrompt(true)}>
        <Plus size={16} aria-hidden="true" />
        {t("politicians.addButton")}
      </button>
      {showPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          onClick={() => setShowPrompt(false)}
        >
          <div className="card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-ink">{t("addPolitician.promptTitle")}</h2>
            <p className="mt-2 text-sm text-ink-muted">{t("addPolitician.promptBody")}</p>
            <div className="mt-5 flex gap-2">
              <Link
                to="/register"
                className="btn-primary flex-1 justify-center"
                onClick={() => setShowPrompt(false)}
              >
                {t("addPolitician.signUp")}
              </Link>
              <Link
                to="/login"
                className="btn-secondary flex-1 justify-center"
                onClick={() => setShowPrompt(false)}
              >
                {t("addPolitician.signIn")}
              </Link>
            </div>
            <button
              type="button"
              className="mt-3 w-full text-center text-xs text-ink-faint hover:text-ink-muted"
              onClick={() => setShowPrompt(false)}
            >
              {t("addPolitician.cancel")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
