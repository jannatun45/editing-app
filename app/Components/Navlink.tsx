import { useState } from "react";
import {
  Menu,
  Home,
  LayoutDashboard,
  Settings,
  FolderPlus,
  User,
  Bell,
  ShoppingCart,
  Lock,
  ChevronDown,
} from "lucide-react";

import { NavLink } from "react-router";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  type MenuItem = {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: {
    label: string;
    path: string;
  }[];
};

  const menuItems: MenuItem[] = [
  {
    label: "Home",
    icon: Home,
    path: "/",
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      {
        label: "Display",
        path: "/settings/display",
      },
      {
        label: "Appearance",
        path: "/settings/appearance",
      },
      {
        label: "Preferences",
        path: "/settings/preferences",
      },
    ],
  },
  {
    label: "Profile",
    icon: User,
    children: [
      {
        label: "Avatar",
        path: "/profile/avatar",
      },
      {
        label: "Theme",
        path: "/profile/theme",
      },
    ],
  },
  {
    label: "Products",
    icon: ShoppingCart,
    path: "/products",
  },
];
  function toggleMenu(name: string) {
    setActiveMenu((current) =>
      current === name ? null : name
    );
  }

  return (
    <aside
      className={`
        fixed
        left-6
        top-6
        bottom-6
        z-50
        flex
        flex-col
        gap-2
        rounded-2xl
        border
        border-white/10
        bg-black/40
        p-4
        text-white
        backdrop-blur-xl
        transition-all
        duration-300
        ${collapsed ? "w-20" : "w-65"}
      `}
    >
      {/* HEADER */}
      <header className="flex h-[72px] items-center border-b border-white/10">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-[50px] w-[52px] items-center justify-center rounded-lg hover:bg-black/20"
        >
          <Menu size={22} />
        </button>

        {!collapsed && <span className="text-lg font-bold">My Editor</span>}
      </header>

      {/* MENU */}
  <ul className="grid w-full list-none gap-1 p-0">
  {menuItems.map((item) => {
    const Icon = item.icon;

    return (
      <li key={item.label}>

        {item.children ? (
          /* MENU YANG PUNYA SUBMENU */
          <button
            type="button"
            onClick={() => handleMenuClick(item)}
            className={`
              relative
              flex
              h-[50px]
              w-full
              items-center
              gap-4
              rounded-md
              px-4
              text-left
              text-base
              font-normal
              transition
              duration-200
              hover:bg-black/10
              ${activeMenu === item.label ? "bg-black/30" : ""}
            `}
          >
            <Icon size={20} className="shrink-0" />

            {!collapsed && (
              <>
                <span className="flex-1">
                  {item.label}
                </span>

                <ChevronDown
                  size={18}
                  className={`
                    transition-transform
                    duration-300
                    ${
                      activeMenu === item.label
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </>
            )}
          </button>
        ) : (
          /* MENU YANG LANGSUNG NAVIGASI */
          <NavLink
            to={item.path!}
            className={({ isActive }) => `
              relative
              flex
              h-[50px]
              w-full
              items-center
              gap-4
              rounded-md
              px-4
              text-left
              text-base
              font-normal
              transition
              duration-200
              hover:bg-black/10
              ${isActive ? "bg-black/30" : ""}
            `}
          >
            <Icon size={20} className="shrink-0" />

            {!collapsed && (
              <span className="flex-1">
                {item.label}
              </span>
            )}
          </NavLink>
        )}

        {/* SUB MENU */}
        {item.children && !collapsed && (
          <div
            className={`
              grid
              overflow-hidden
              transition-all
              duration-500
              ${
                activeMenu === item.label
                  ? "max-h-60"
                  : "max-h-0"
              }
            `}
          >
            <ul className="grid">
              {item.children.map((child) => (
                <li key={child.label}>
                  <NavLink
                    to={child.path}
                    className={({ isActive }) => `
                      relative
                      flex
                      h-[50px]
                      w-full
                      items-center
                      rounded-md
                      pl-[52px]
                      text-left
                      text-sm
                      text-white/90
                      hover:bg-black/10
                      ${isActive ? "bg-black/30" : ""}
                    `}
                  >
                    <span
                      className="
                        absolute
                        left-6
                        top-1/2
                        h-[5px]
                        w-[5px]
                        -translate-y-1/2
                        rounded-full
                        bg-white/35
                      "
                    />

                    {child.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  })}
</ul>
    </aside>
  );
}