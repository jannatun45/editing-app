import {
  Home,
  LayoutFreeform,
  ArrowDownToLine,
  Handshake,
  Play,
  Volleyball,
  CircleUserRound,
  Goal,
} from "lucide-react";
import type { MenuItem } from "~/types/sidenav/menuItems";

export const menuItems: MenuItem[] = [
  {
    label: "matches",
    icon: Play,
    path: "/",
  },
  {
    label: "Players",
    icon: CircleUserRound,
    path: "/players",
  },
  {
    label: "standing",
    icon: LayoutFreeform,
    path: "/standing",
  },
  {
    label: "standing copy",
    icon: LayoutFreeform,
    path: "/standing-copy",
  },
  {
    label: "top-scorers",
    icon: Volleyball,
    path: "/top-scorers",
  },
  {
    label: "top-assists",
    icon: Handshake,
    path: "/top-assists",
  },
  {
    label: "stadium",
    icon: Goal,
    path: "/stadium",
  },
];
