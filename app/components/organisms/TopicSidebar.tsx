import TopicGroup from "../molecules/TopicGroup";
import type { TopicGroup as TopicGroupType } from "~/types/topic";

interface TopicSidebarProps {
  topics: TopicGroupType[];
}

export default function TopicSidebar({ topics }: TopicSidebarProps) {
  return (
    <aside className="relative">
      {topics.map((group) => (
        <TopicGroup key={group.title} group={group} />
      ))}
    </aside>
  );
}
