import Sidebar from "../organisms/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex justify-end items-center overflow-hidden mr-2 text-white">

      {/* sidebar */}
      <Sidebar/>

      {/* Container utama */}
      <div className="w-[1400px] min-h-screen bg-red-500">
        {/* Isi halaman */}
        <main className="min-h-screen">
          {children}
        </main>

      </div>

    </div>
  );
}