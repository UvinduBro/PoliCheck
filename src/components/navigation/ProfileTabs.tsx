import { NavLink } from "react-router-dom";

export interface ProfileTabDef {
  path: string;
  label: string;
}

export function ProfileTabs({ basePath, tabs }: { basePath: string; tabs: ProfileTabDef[] }) {
  return (
    <nav aria-label="Politician profile sections" className="border-b border-slate-200 dark:border-slate-800">
      <ul className="scroll-fade-x flex flex-nowrap gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <li key={tab.path} className="shrink-0">
            <NavLink
              to={`${basePath}/${tab.path}`}
              end={tab.path === ""}
              className={({ isActive }) =>
                `inline-block whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:text-white dark:text-slate-400 dark:text-slate-500 dark:hover:border-slate-700 dark:hover:text-white"
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
