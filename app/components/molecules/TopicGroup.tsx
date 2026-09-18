import TopicItem from "../atoms/TopicItem";
import type { TopicGroup as TopicGroupType } from "~/types/sidenav/topicGrupTypes";

interface TopicGroupProps {
  group: TopicGroupType;
}

export default function TopicGroup({ group }: TopicGroupProps) {
  return (
    <div className="">
      <h3 className="my-2 text-xs font-bold uppercase text-gray-600">
        {group.title}
      </h3>

      <div className=" flex flex-col gap-2 border-l ml-3">
        {group.items.map((item) => (
          <TopicItem key={item.href} label={item.label} path={item.href} />
        ))}
      </div>
    </div>
  );
}
