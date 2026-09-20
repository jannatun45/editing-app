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
} from "lucide-react";
import type { MenuItem } from "~/types/sidenav/menuItems";

export const menuItems: MenuItem[] = [
  {
    label: "Home",
    icon: Home,
    path: "/",
  },
  {
    label: "standing",
    icon: LayoutFreeform,
    path: "/standing",
  },
  {
    label: "download",
    icon: ArrowDownToLine,
    path: "/download",
  },
  {
    label: "matches",
    icon: ArrowDownToLine,
    path: "/matches",
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
