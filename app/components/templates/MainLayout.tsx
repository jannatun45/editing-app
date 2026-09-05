import Sidebar from "../organisms/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex justify-end items-center overflow-hidden text-white">

      {/* sidebar */}
      <Sidebar/>

      {/* Container utama */}
      <div className="w-[1485px] min-h-screen">

        {/* Isi halaman */}
        <main className="min-h-screen">
          {children}
        </main>

      </div>

    </div>
  );
}