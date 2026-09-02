import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";
import { useCommandSearchContext } from "@/features/search/CommandSearchContext";
import { useFeatureFlags } from "@/features/settings/api";
import { CivicLensMark } from "./CivicLensMark";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "./ThemeToggle";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "text-ink" : "text-ink-muted hover:text-ink"
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
    isActive ? "bg-surface-2 text-ink" : "text-ink-muted hover:bg-surface-2 hover:text-ink"
  }`;

export function Header() {
  const { user, userProfile } = useAuth();
  const role = userProfile?.role;
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSearch } = useCommandSearchContext();
  const { flags } = useFeatureFlags();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const links = [
    { to: "/", label: "Discover", show: true, end: true },
    { to: "/politicians", label: "Politicians", show: true },
    { to: "/cases", label: "Cases", show: true },
    { to: "/investigations", label: "Investigations", show: flags.investigations },
    { to: "/sources", label: "Sources", show: flags.sources },
    { to: "/research", label: "Research", show: can.createRecords(role) },
    { to: "/review", label: "Review", show: can.reviewRecords(role) },
    { to: "/admin", label: "Admin", show: can.manageUsers(role) },
  ].filter((link) => link.show);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-ink">
          <CivicLensMark size={20} className="text-accent" />
          <span className="text-[15px] font-semibold tracking-tight">CivicLens</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onClick={openSearch}
            className="flex min-h-[2.5rem] items-center gap-2 rounded-md border border-line bg-surface-2/60 px-3 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            <Search size={15} aria-hidden="true" />
            Search
            <kbd className="ml-1 rounded border border-line bg-surface px-1.5 py-0.5 text-[11px] text-ink-faint">
              ⌘K
            </kbd>
          </button>
          <NotificationsMenu />
          <ThemeToggle />
          <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
          <UserMenu />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-muted hover:bg-surface-2 hover:text-ink"
          >
            <Search size={18} aria-hidden="true" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-muted hover:bg-surface-2 hover:text-ink"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="animate-fade-in space-y-1 border-t border-line bg-surface px-4 py-3 lg:hidden"
        >
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={mobileNavLinkClass}>
              {link.label}
            </NavLink>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
            {user ? (
              <Link to="/account" className={mobileNavLinkClass({ isActive: false })}>
                Account
              </Link>
            ) : (
              <Link to="/login" className="btn-primary w-full">
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
