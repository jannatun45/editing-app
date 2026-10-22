import {
  Home,
  LayoutFreeform,
  ArrowDownToLine,
  Handshake,
  Play,
  Volleyball,
  CircleUserRound,
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
    label: "download",
    icon: ArrowDownToLine,
    path: "/download",
  },
];
