// components/molecules/ArticleSection.tsx

import type { ReactNode } from "react";

type ArticleSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function ArticleSection({
  id,
  title,
  children,
}: ArticleSectionProps) {
  return (
    // id digunakan sebagai target anchor dari Table of Contents
    <section id={id} className="mb-6 scroll-mt-8">
      {/* Judul setiap bab */}
      <h2 className="rounded-tl-md mb-4 w-fit px-3 py-0.5 bg-zinc-800 text-zinc-400 text-sm font-bold">
        {title}
      </h2>

      {/* Isi artikel */}
      <div className=" space-y-5 text-xs tracking-wider text-gray-300 leading-0">
        {children}
      </div>
    </section>
  );
}
