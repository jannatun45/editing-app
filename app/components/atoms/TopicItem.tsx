import { NavLink } from "react-router";

interface TopicItemProps {
  label: string;
  path: string;
}

export default function TopicItem({ label, path }: TopicItemProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `px-3 text-sm transition border-l-2 hover:border-zinc-300 hover:text-zinc-300 border-zinc-900 ${
          isActive ? "" : "text-gray-500 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
