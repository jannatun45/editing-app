export type TopicItem = {
  title: string;
  path: string;
};

export type TopicGroup = {
  title: string;
  items: TopicItem[];
};

export type Topic = {
  id: string;
  label: string;
};
