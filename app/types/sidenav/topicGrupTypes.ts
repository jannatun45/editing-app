export type TopicHome = {
  title: string;
  id: string;
};

export type TopicItem = {
  title: string;
  href: string;
};

export type TopicGroup = {
  title: string;
  items: TopicItem[];
};
