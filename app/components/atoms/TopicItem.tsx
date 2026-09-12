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
        `px-3 text-sm transition border-l-2 hover:border-zinc-300 hover:text-zinc-300 border-zinc-900 ${
          isActive ? "" : "text-gray-500 hover:bg-white/5 hover:text-white"
        }`
      }
      // className={`
      //     block
      //     border-l-2
      //     py-1
      //     pl-4
      //     text-sm
      //     transition
      //     border-transparent text-gray-400 hover:border-white/50 hover:text-white"
      //   `}
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
