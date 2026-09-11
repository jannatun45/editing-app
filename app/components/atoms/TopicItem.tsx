import { NavLink } from "react-router";

interface TopicItemProps {
  title: string;

  path: string;
}

export default function TopicItem({ title, path }: TopicItemProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `block rounded-md px-3 py-2 text-sm transition ${
          isActive
            ? "bg-white/10 text-white"
            : "text-gray-500 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {title}
    </NavLink>
    // <li>
    // <a
    // href={`#${id}`}
    // className={`
    //       block
    //       border-l-2
    //       py-1
    //       pl-4
    //       text-sm
    //       transition

    //       ${
    //         active
    //           ? "border-white text-white font-medium"
    //           : "border-transparent text-gray-400 hover:border-white/50 hover:text-white"
    //       }
    //     `}
    //   ></a>
    //   {title}
    // </li>
  );
}
