import { Bell, BellOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * There's no notification system in the data model yet — this is an honest empty state,
 * not a placeholder for fabricated alerts, kept as a nav affordance per the design spec.
 */
export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <Bell size={18} aria-hidden="true" />
      </button>
      {open && (
        <div
          role="menu"
          className="animate-scale-in absolute right-0 top-full z-30 mt-2 w-72 rounded-lg border border-line bg-surface p-4 text-center shadow-elevated"
        >
          <BellOff size={20} className="mx-auto text-ink-faint" aria-hidden="true" />
          <p className="mt-2 text-sm font-medium text-ink">No notifications yet</p>
          <p className="mt-1 text-xs text-ink-muted">
            You'll see updates here when a profile you follow changes or a review needs your attention.
          </p>
        </div>
      )}
    </div>
  );
}
