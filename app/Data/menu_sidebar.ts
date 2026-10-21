import {
  Menu,
  Home,
  LayoutDashboard,
  Settings,
  FolderPlus,
  User,
  Bell,
  ShoppingCart,
  Lock,
  LayoutFreeform,
  List,
  BookOpenText,
  FileQuestionMark,
  MonitorSmartphone,
  Coffee,
  ArrowDownToLine,
  Handshake,
  Play,
  Volleyball,
  CircleUserRound,
} from "lucide-react";
import type { MenuItem } from "~/types/sidenav/menuItems";

export const menuItems: MenuItem[] = [
  {
    label: "Home",
    icon: Home,
    path: "/",
  },
  {
    label: "Players",
    icon: CircleUserRound,
    path: "/players",
  },
  {
    label: "matches",
    icon: Play,
    path: "/matches",
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
  {
    label: "learning",
    icon: BookOpenText,
    path: "/learning",
    children: [
      {
        label: "snippet",
        path: "learning/snippet",
      },
      {
        label: "git",
        path: "learning/git",
      },
    ],
  },
];
