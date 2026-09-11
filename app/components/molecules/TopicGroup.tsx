import TopicItem from "../atoms/TopicItem";
import type { TopicGroup as TopicGroupType } from "~/types/topic";

interface TopicGroupProps {
  group: TopicGroupType;
}

export default function TopicGroup({ group }: TopicGroupProps) {
  return (
    <div className="">
      <h3 className="mb-2 px-3 text-xs font-bold uppercase text-gray-600">
        {group.title}
      </h3>

      <div className="flex flex-col gap-1">
        {group.items.map((item) => (
          <TopicItem key={item.path} title={item.title} path={item.path} />
        ))}
      </div>
    </div>
  );
}
