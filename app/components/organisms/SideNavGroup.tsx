import TopicGroup from "../molecules/TopicGroup";
import type { TopicGroup as TopicGroupType } from "~/types/sidenav/topicGrupTypes";

interface SideNavProps {
  topics: TopicGroupType[];
}

export default function SideNavGroup({ topics }: SideNavProps) {
  return (
    <aside className="relative block">
      <div className="fixed ">
        {topics.map((group) => (
          <TopicGroup key={group.title} group={group} />
        ))}
      </div>
    </aside>
  );
}
