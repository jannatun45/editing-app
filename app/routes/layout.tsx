import { Outlet } from "react-router";
import Sidebar from "~/components/organisms/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen flex justify-end items-center overflow-hidden text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Container utama */}
      <div className="w-[75%] pr-36 min-h-screen ">
        <Outlet />
      </div>
    </div>
  );
}
