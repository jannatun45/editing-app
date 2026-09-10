import { NavLink } from "react-router";
import Sidebar from "~/components/organisms/Sidebar";
import { useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: MainLayoutProps) {
  useEffect(() => {
    console.log("Lebar browser:", window.innerWidth);
    console.log("Tinggi browser:", window.innerHeight);
  }, []);
  return (
    <div className="min-h-screen flex justify-end items-center overflow-hidden text-white ">
      {/* sidebar */}
      <Sidebar />

      {/* Container utama */}
      <div className="w-[83%] min-h-screen">
        <div className="min-h-screen">{children}</div>
      </div>
    </div>
  );
}
