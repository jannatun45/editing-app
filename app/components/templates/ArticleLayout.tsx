import type { ReactNode } from "react";
import TableOfContents from "../organisms/TableOfContents";

type ArticleLayoutProps = {
  children: ReactNode;
};

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-8 py-12 bg-zinc-950">
      <div className="grid grid-cols-[1fr_198px] gap-12">
        <main className="min-w-0">{children}</main>
        <aside className="relative">
          <div
            className="
            fixed"
          >
            <TableOfContents />
          </div>
        </aside>
      </div>
    </div>
  );
}
