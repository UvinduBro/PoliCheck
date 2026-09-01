import { Menu, Scale, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";
import { ThemeToggle } from "./ThemeToggle";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-brand-50 text-brand-800 dark:bg-brand-500/15 dark:text-brand-300"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
    isActive
      ? "bg-brand-50 text-brand-800 dark:bg-brand-500/15 dark:text-brand-300"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;

export function Header() {
  const { user, userProfile } = useAuth();
  const role = userProfile?.role;
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const links = [
    { to: "/search", label: "Search", show: true },
    { to: "/politicians", label: "Politicians", show: true },
    { to: "/research", label: "Research", show: can.createRecords(role) },
    { to: "/review", label: "Review", show: can.reviewRecords(role) },
    { to: "/admin", label: "Admin", show: can.manageUsers(role) },
  ].filter((link) => link.show);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white dark:bg-brand-500">
            <Scale aria-hidden="true" size={18} />
          </span>
          <span className="text-lg font-semibold">PoliCheck</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <NavLink to="/account" className={navLinkClass}>
              Account
            </NavLink>
          ) : (
            <NavLink to="/login" className="btn-primary">
              Sign in
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Primary"
          className="animate-fade-in space-y-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={mobileNavLinkClass}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <NavLink to="/account" className={mobileNavLinkClass}>
              Account
            </NavLink>
          ) : (
            <NavLink to="/login" className="btn-primary mt-2 w-full">
              Sign in
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}
