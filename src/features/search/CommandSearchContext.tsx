import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CommandSearchDialog } from "@/components/search/CommandSearchDialog";

interface CommandSearchContextValue {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const CommandSearchContext = createContext<CommandSearchContextValue | null>(null);

export function useCommandSearchContext(): CommandSearchContextValue {
  const ctx = useContext(CommandSearchContext);
  if (!ctx) throw new Error("useCommandSearchContext must be used within CommandSearchProvider");
  return ctx;
}

export function CommandSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);
  const closeSearch = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(() => ({ open, openSearch, closeSearch }), [open, openSearch, closeSearch]);

  return (
    <CommandSearchContext.Provider value={value}>
      {children}
      <CommandSearchDialog open={open} onClose={closeSearch} />
    </CommandSearchContext.Provider>
  );
}
