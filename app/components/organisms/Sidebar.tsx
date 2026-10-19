import {
  ChevronDown,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { menuItems } from "~/data/menu_sidebar";
import type { MenuItem } from "~/types/sidenav/menuItems";

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  function handleMenuClick(item: MenuItem) {
    if (!item.children) return;

    setActiveMenu((current) => (current === item.label ? null : item.label));
  }

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        border-r border-white/[0.08]
        bg-[#080e19] text-white
        shadow-2xl shadow-black/30
        transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-[76px]" : "w-[270px]"}
      `}
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-amber-400/[0.07] to-transparent" />

      {/* ================= HEADER ================= */}
      <header
        className={`relative flex h-[88px] shrink-0 items-center border-b border-white/[0.08] ${
          collapsed ? "justify-center px-2" : "gap-3 px-5"
        }`}
      >
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-amber-400/30 hover:bg-amber-400/10 hover:text-amber-300"
        >
          {collapsed ? (
            <PanelLeftOpen size={19} />
          ) : (
            <PanelLeftClose size={19} />
          )}
        </button>

        {!collapsed && (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Shield size={22} className="shrink-0 text-amber-400" />

              <span
                className="truncate text-lg font-black uppercase tracking-[0.16em]"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                Profile
              </span>
            </div>

            <div className="mt-1 flex items-center gap-1.5 pl-[30px]">
              <Sparkles size={10} className="text-amber-400" />
              <span
                className="text-[11px] text-slate-400"
                style={{ fontFamily: "Alex Brush, cursive" }}
              >
                dark impulsive
              </span>
            </div>
          </div>
        )}
      </header>

      {/* ================= SECTION LABEL ================= */}
      {!collapsed && (
        <div className="relative px-5 pb-2 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
            Workspace
          </p>
        </div>
      )}

      {/* ================= MENU ================= */}
      <nav className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-5 pt-3">
        <ul className="m-0 grid list-none gap-1.5 p-0">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const hasActiveChild =
              item.children?.some(
                (child) => location.pathname === child.path,
              ) ?? false;

            const isExpanded = activeMenu === item.label;
            const isActive = isExpanded || hasActiveChild;

            const itemClass = `
              group relative flex h-12 w-full items-center gap-3
              rounded-xl px-3 text-left text-sm
              transition-all duration-200
              ${
                isActive
                  ? "border border-amber-400/15 bg-gradient-to-r from-amber-400/[0.14] to-amber-400/[0.03] text-amber-300"
                  : "border border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white"
              }
              ${collapsed ? "justify-center px-0" : ""}
            `;

            return (
              <li key={item.label}>
                {item.children ? (
                  <button
                    type="button"
                    onClick={() => handleMenuClick(item)}
                    title={collapsed ? item.label : undefined}
                    aria-expanded={isExpanded}
                    className={itemClass}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-amber-400" />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={`shrink-0 transition ${
                        isActive
                          ? "text-amber-300"
                          : "text-slate-400 group-hover:text-white"
                      }`}
                    />

                    {!collapsed && (
                      <>
                        <span className="min-w-0 flex-1 truncate font-medium">
                          {item.label}
                        </span>

                        <ChevronDown
                          size={16}
                          className={`shrink-0 text-slate-500 transition-transform duration-300 ${
                            isExpanded ? "rotate-180 text-amber-300" : ""
                          }`}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <NavLink
                    to={item.path!}
                    end
                    title={collapsed ? item.label : undefined}
                    className={({ isActive: routeIsActive }) => `
                      ${itemClass}
                      ${
                        routeIsActive
                          ? "!border-amber-400/15 !bg-gradient-to-r !from-amber-400/[0.14] !to-amber-400/[0.03] !text-amber-300"
                          : ""
                      }
                    `}
                  >
                    {({ isActive: routeIsActive }) => (
                      <>
                        {routeIsActive && (
                          <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-amber-400" />
                        )}

                        <Icon
                          size={19}
                          strokeWidth={routeIsActive ? 2.2 : 1.8}
                          className={`shrink-0 transition ${
                            routeIsActive
                              ? "text-amber-300"
                              : "text-slate-400 group-hover:text-white"
                          }`}
                        />

                        {!collapsed && (
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {item.label}
                          </span>
                        )}

                        {!collapsed && routeIsActive && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
                        )}
                      </>
                    )}
                  </NavLink>
                )}

                {/* ================= SUBMENU ================= */}
                {item.children && !collapsed && (
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="ml-5 mt-1 grid list-none gap-1 border-l border-white/10 py-1 pl-3">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <NavLink
                              to={child.path}
                              end
                              className={({ isActive }) => `
                                relative flex min-h-10 items-center gap-2
                                rounded-lg px-3 text-xs transition
                                ${
                                  isActive
                                    ? "bg-amber-400/10 font-semibold text-amber-300"
                                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                }
                              `}
                            >
                              {({ isActive }) => (
                                <>
                                  <span
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition ${
                                      isActive ? "bg-amber-400" : "bg-slate-600"
                                    }`}
                                  />

                                  <span className="min-w-0 flex-1 truncate">
                                    {child.label}
                                  </span>
                                </>
                              )}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ================= FOOTER ================= */}
      <footer className="relative shrink-0 border-t border-white/[0.08] p-3">
        {collapsed ? (
          <div
            title="Dark Impulsive"
            className="flex h-10 items-center justify-center rounded-xl bg-amber-400/[0.08] text-amber-400"
          >
            <Shield size={19} />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-300 to-amber-600 text-sm font-black text-slate-950">
              DI
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-200">
                Dark Impulsive
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Football Dashboard
              </p>
            </div>

            <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
          </div>
        )}
      </footer>
    </aside>
  );
}
