import type { LucideIcon } from "lucide-react";
import { ClipboardList, FileSearch, Gavel, LayoutDashboard, ScrollText, ShieldCheck, Users } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { can } from "@/lib/permissions/roles";

interface WorkspaceNavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  end?: boolean;
  show: boolean;
}

export function WorkspaceLayout() {
  const { userProfile } = useAuth();
  const role = userProfile?.role;

  const items: WorkspaceNavItem[] = [
    {
      to: "/research",
      label: "Overview",
      description: "Quick actions & drafts",
      icon: LayoutDashboard,
      end: true,
      show: can.createRecords(role),
    },
    { to: "/politicians", label: "Politicians", description: "Search & profiles", icon: Users, show: true },
    { to: "/cases", label: "Cases", description: "Criminal & civil records", icon: Gavel, show: true },
    { to: "/investigations", label: "Investigations", description: "Agency inquiries", icon: FileSearch, show: true },
    { to: "/sources", label: "Sources", description: "Citations & documents", icon: ScrollText, show: true },
    {
      to: "/review",
      label: "Review queue",
      description: "Pending publication",
      icon: ClipboardList,
      show: can.reviewRecords(role),
    },
    { to: "/admin", label: "Admin", description: "Users & audit log", icon: ShieldCheck, show: can.manageUsers(role) },
  ].filter((item) => item.show);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <aside className="lg:sticky lg:top-[81px] lg:w-56 lg:shrink-0">
        <p className="eyebrow px-1 lg:px-0">Workspace</p>
        <nav
          aria-label="Research workspace"
          className="mt-2 flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex shrink-0 items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors lg:shrink lg:border-transparent ${
                  isActive
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink lg:border-transparent lg:bg-transparent lg:hover:bg-surface-2"
                }`
              }
            >
              <item.icon size={16} className="shrink-0" aria-hidden="true" />
              <span className="flex flex-col">
                <span className="font-medium leading-tight">{item.label}</span>
                <span className="hidden text-xs leading-tight text-ink-faint lg:block">{item.description}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
