import { NavLink } from "react-router";

type SidebarProps = {
  onNavigate?: () => void;
};

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/subscription", label: "Subscription" },
  { to: "/settings", label: "Settings" },
] as const;

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-ui-6 bg-ui-8 p-5">
      <div className="border-b border-ui-6 pb-5">
        <p className="text-ui-0 text-lg font-semibold">uploady.app</p>
        <p className="mt-1 text-sm text-ui-4">Premium Starter Plan</p>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-2">
        <p className="text-ui-4 px-2 text-xs uppercase tracking-[0.18em]">General</p>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "border px-3 py-2 text-sm font-medium transition-colors rounded-[10px]",
                isActive
                  ? "border-transparent bg-ui-7 text-ui-0"
                  : "border-transparent text-ui-3 hover:border-ui-6 hover:bg-ui-7 hover:text-ui-0",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ui-6 pt-4">
        <p className="text-ui-1 text-sm font-medium">Lila Thompson</p>
        <p className="text-ui-4 text-sm">artisticflow@gmail.com</p>
      </div>
    </aside>
  );
}
