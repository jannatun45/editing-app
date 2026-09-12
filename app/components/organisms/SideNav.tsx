import { useEffect, useState } from "react";
import TableOfContentsItem from "../molecules/TableOfContentsItem";
import type { TopicHome } from "~/types/sidenav/topicGrupTypes";

type TableOfContentProps = {
  topics: TopicHome[];
};

export default function SideNav({ topics }: TableOfContentProps) {
  // Menyimpan ID section yang sedang aktif
  const [activeId, setActiveId] = useState("introduction");

  useEffect(() => {
    // Ambil semua section berdasarkan ID
    const sections = topics
      .map((topic) => document.getElementById(topic.id))
      .filter(Boolean);

    // Observer untuk mendeteksi section yang sedang terlihat
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);

        if (visibleSection) {
          setActiveId(visibleSection.target.id);
        }
      },
      {
        // Area deteksi dibuat di sekitar bagian atas layar
        rootMargin: "-20% 0px -60% 0px",
      },
    );

    // Mulai mengamati setiap section
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Bersihkan observer ketika component unmount
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="relative">
      <div className="fixed">
        {/* Judul daftar isi */}
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          On this page
        </h2>

        <ul className="space-y-2 border-l border-white/10">
          {topics.map((topic) => (
            <TableOfContentsItem
              key={topic.id}
              id={topic.id}
              title={topic.title}
              active={activeId === topic.id}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}
