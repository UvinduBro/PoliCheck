import { NavLink } from "react-router-dom";

export interface ProfileTabDef {
  path: string;
  label: string;
}

export function ProfileTabs({ basePath, tabs }: { basePath: string; tabs: ProfileTabDef[] }) {
  return (
    <nav
      aria-label="Politician profile sections"
      className="sticky top-[57px] z-20 -mx-4 border-b border-line bg-bg/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[65px]"
    >
      <ul className="scroll-fade-x flex flex-nowrap gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <li key={tab.path} className="shrink-0">
            <NavLink
              to={`${basePath}/${tab.path}`}
              end={tab.path === ""}
              className={({ isActive }) =>
                `inline-block whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "border-accent text-ink" : "border-transparent text-ink-muted hover:text-ink"
                }`
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
