import type { ReactNode } from "react";
import SideNav from "../organisms/SideNav";
import type { TopicHome } from "~/types/sidenav/topicGrupTypes";

type ArticleLayoutProps = {
  children: ReactNode;
  topics: TopicHome[];
};

export default function ArticleLayout({
  children,
  topics,
}: ArticleLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-8 py-12 bg-zinc-950">
      <div className="grid grid-cols-[1fr_198px] gap-12">
        <main className="min-w-0">{children}</main>
        <SideNav topics={topics} />
      </div>
    </div>
  );
}
