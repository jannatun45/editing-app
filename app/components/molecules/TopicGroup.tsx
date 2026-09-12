import { log } from "console";
import TopicItem from "../atoms/TopicItem";
import type { TopicGroup as TopicGroupType } from "~/types/sidenav/topicTypes";

interface TopicGroupProps {
  group: TopicGroupType;
}

export default function TopicGroup({ group }: TopicGroupProps) {
  log("group in topic group -> ", group);
  return (
    <div className="">
      <h3 className="my-2 text-xs font-bold uppercase text-gray-600">
        {group.title}
      </h3>

      <div className=" flex flex-col gap-2 border-l-2 ml-3">
        {/* <div className="space-y-2 border-l border-white/10"> */}
        {group.items.map((item) => (
          <TopicItem key={item.href} title={item.title} path={item.href} />
        ))}
      </div>
    </div>
  );
}
