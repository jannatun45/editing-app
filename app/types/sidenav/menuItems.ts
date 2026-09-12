import type { SubMenuItem } from "./subMenuItems";

export type MenuItem = {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: SubMenuItem[];
};
