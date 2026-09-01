import { Scale } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-blue-800" : "text-gray-700 hover:bg-gray-100"}`;

export function Header() {
  const { user, userProfile } = useAuth();
  const role = userProfile?.role;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-gray-900">
          <Scale aria-hidden="true" className="text-blue-700" />
          <span className="text-lg font-semibold">PoliCheck</span>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-1">
          <NavLink to="/search" className={navLinkClass}>Search</NavLink>
          <NavLink to="/politicians" className={navLinkClass}>Politicians</NavLink>
          {can.createRecords(role) && <NavLink to="/research" className={navLinkClass}>Research</NavLink>}
          {can.reviewRecords(role) && <NavLink to="/review" className={navLinkClass}>Review</NavLink>}
          {can.manageUsers(role) && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
          {user ? (
            <NavLink to="/account" className={navLinkClass}>Account</NavLink>
          ) : (
            <NavLink to="/login" className="btn-primary ml-2">Sign in</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
