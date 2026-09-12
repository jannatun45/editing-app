import type { ReactNode } from "react";
import SideNav from "../organisms/SideNav";
import type { TopicGroup } from "~/types/sidenav/topicTypes";

interface MainLayoutProps {
  children: ReactNode;

  // Optional karena tidak semua halaman mempunyai topics
  topics?: TopicGroup[];
}

export default function MainLayout({ children, topics }: MainLayoutProps) {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-8 py-12 bg-zinc-950">
      <div className="grid grid-cols-[1fr_198px] gap-12">
        {/* Content */}
        <main className="relative">
          {/* Isi halaman */}
          {children}
        </main>
        {/* Topic hanya muncul kalau diberikan */}
        {topics && <SideNav topics={topics} />}
      </div>
    </div>
  );
}
