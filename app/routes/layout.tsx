import { Outlet } from "react-router";
import Sidebar from "~/components/organisms/Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen flex justify-end items-center overflow-hidden text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Container utama */}
      <div className="w-[83%] min-h-screen">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
