import { NavLink } from "react-router-dom";

export interface ProfileTabDef {
  path: string;
  label: string;
}

export function ProfileTabs({ basePath, tabs }: { basePath: string; tabs: ProfileTabDef[] }) {
  return (
    <nav aria-label="Politician profile sections" className="border-b border-gray-200">
      <ul className="flex flex-wrap gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <li key={tab.path}>
            <NavLink
              to={`${basePath}/${tab.path}`}
              end={tab.path === ""}
              className={({ isActive }) =>
                `inline-block whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "border-blue-700 text-blue-800"
                    : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
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
