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

type SubMenuItem = {
  label: string,
  path: string
}

type MenuItem = {
  label: string;
  icon: React.ElementType;
  path?: string,
  children?: SubMenuItem[];
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
    label: "Create",
    icon: FolderPlus,
    children: [
      {
        label: "Article",
        path: "/create/article",
      },
      {
        label: "Document",
        path: "/create/document",
      },
      {
        label: "Video",
        path: "/create/video",
      },
      {
        label: "Presentation",
        path: "/create/presentation",
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
    label: "Notifications",
    icon: Bell,
    path: "/notifications",

  },
  {
    label: "Products",
    icon: ShoppingCart,
    path: "/products",

  },
  {
    label: "Account",
    icon: Lock,
    path: "/account",

  },
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  function handleMenuClick(item: MenuItem) {
    if (!item.children) {
      setActiveMenu(item.label);
      return;
    }

    if (activeMenu === item.label) {
      setActiveMenu(null);
    } else {
      setActiveMenu(item.label);
    }
  }

  return (
    <aside
      className={`
        fixed
        top-6
        left-6
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
        shadow-xl
        backdrop-blur-xl
        transition-all
        duration-400
        ${collapsed ? "w-20" : "w-65"}
      `}
    >
      {/* Header */}
      <header className="flex h-18 shrink-0 items-center border-b border-white/10">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-[50px] w-[52px] items-center justify-center rounded-lg hover:bg-black/20"
        >
          <Menu size={22} />
        </button>

        {!collapsed && (
          <div className="flex items-center">
            <span className="text-lg font-bold">My Editor</span>
          </div>
        )}
      </header>

      {/* Menu */}
      <ul className="grid w-full list-none gap-1 p-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.label;

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
                  ${isActive ? "bg-black/30" : ""}
                `}
                >
                  <Icon size={20} className="shrink-0" />

                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>

                      {item.children && (
                        <ChevronDown
                          size={18}
                          className={`
                          transition-transform
                          duration-300
                          ${isActive ? "rotate-180" : ""}
                        `}
                        />
                      )}
                    </>
                  )}
                </button>
              ) : (
                /* MENU YANG LANGSUNG NAVIGASI */
                <NavLink
                  to={item.path!}
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
                  ${isActive ? "bg-black/30" : ""}
                `}
                >
                  <Icon size={20} className="shrink-0" />

                  {!collapsed && <span className="flex-1">{item.label}</span>}
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
              ${activeMenu === item.label ? "max-h-60" : "max-h-0"}
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
              {/* {item.children && !collapsed && (
                <div
                  className={`
                    grid
                    overflow-hidden
                    transition-all
                    duration-500
                    ${isActive ? "max-h-60" : "max-h-0"}
                  `}
                >
                  <ul className="grid">
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <button
                          type="button"
                          className="
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
                          "
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
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}