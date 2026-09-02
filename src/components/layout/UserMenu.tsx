import { LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";

function initialsFor(name: string, email: string): string {
  const source = name.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { t } = useTranslation();
  const { user, userProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!user) {
    return (
      <Link to="/login" className="btn-primary">
        {t("nav.signIn")}
      </Link>
    );
  }

  const displayName = userProfile?.displayName || user.displayName || "";
  const initials = initialsFor(displayName, user.email ?? "U");

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("nav.accountMenu")}
        aria-expanded={open}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-fg transition-opacity hover:opacity-90"
      >
        {initials}
      </button>
      {open && (
        <div
          role="menu"
          className="animate-scale-in absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-lg border border-line bg-surface shadow-elevated"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{displayName || user.email}</p>
            <p className="mt-0.5 text-xs text-ink-muted">{t(`roles.${userProfile?.role ?? "public"}`)}</p>
          </div>
          <Link
            to="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-surface-2"
          >
            <UserRound size={15} aria-hidden="true" />
            {t("nav.account")}
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink hover:bg-surface-2"
          >
            <LogOut size={15} aria-hidden="true" />
            {t("nav.signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
