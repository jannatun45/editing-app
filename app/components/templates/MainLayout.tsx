import { NavLink } from "react-router";
import Sidebar from "../organisms/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex justify-end items-center overflow-hidden text-white">
      {/* sidebar */}
      <Sidebar />

      {/* Container utama */}
      <div className="w-[1470px] min-h-screen">
        {/* <nav className="border-b">
          <div className="mx-auto flex max-w-7xl gap-6 px-6 py-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-black"
                  : "text-gray-500 hover:text-black"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/list"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-black"
                  : "text-gray-500 hover:text-black"
              }
            >
              List Check
            </NavLink>

            <NavLink
              to="/belajar"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-black"
                  : "text-gray-500 hover:text-black"
              }
            >
              Belajar
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-black"
                  : "text-gray-500 hover:text-black"
              }
            >
              Profile
            </NavLink>
          </div>
        </nav> */}
        {/* Isi halaman */}
        <div className="min-h-screen">{children}</div>
      </div>
    </div>
  );
}
