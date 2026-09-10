import type { ReactNode } from "react";
import TableOfContents from "../organisms/TableOfContents";
import type { Topic } from "~/types/topic";

type ArticleLayoutProps = {
  children: ReactNode;
  topics: Topic[];
};

export default function ArticleLayout({
  children,
  topics,
}: ArticleLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-8 py-12 bg-zinc-950">
      <div className="grid grid-cols-[1fr_198px] gap-12">
        <main className="min-w-0">{children}</main>
        <aside className="relative">
          <div className="fixed">
            <TableOfContents topics={topics} />
          </div>
        </aside>
      </div>
    </div>
  );
}
