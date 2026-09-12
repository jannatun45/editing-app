import TopicGroup from "../molecules/TopicGroup";
import type { TopicGroup as TopicGroupType } from "~/types/sidenav/topicGrupTypes";

interface SideNavProps {
  topics: TopicGroupType[];
}

export default function SideNav({ topics }: SideNavProps) {
  return (
    <aside className="relative">
      {topics.map((group) => (
        <TopicGroup key={group.title} group={group} />
      ))}
    </aside>
  );
}
// <aside className="relative">
//   <div className="fixed">
//     <TableOfContents topics={topics} />
//   </div>
// </aside>
