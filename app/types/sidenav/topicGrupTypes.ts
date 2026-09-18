export type TopicHome = {
  title: string;
  id: string;
};

export type TopicItem = {
  label: string;
  href: string;
};

export type TopicGroup = {
  title: string;
  items: TopicItem[];
};
