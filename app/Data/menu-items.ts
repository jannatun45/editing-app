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
} from "lucide-react";
import type { MenuItem } from "~/types/sidebar/menuItems";

export const menuItems: MenuItem[] = [
  {
    label: "Home",
    icon: Home,
    path: "/",
  },
  {
    label: "List check",
    icon: List,
    path: "/list",
  },
  {
    label: "belajar",
    icon: BookOpenText,
    path: "/belajar",
    children: [
      {
        label: "snippet",
        path: "/belajar/snippet",
      },
    ],
  },
  {
    label: "pertanyaan",
    icon: FileQuestionMark,
    path: "/pertanyaan",
  },
  {
    label: "Standing",
    icon: LayoutFreeform,
    path: "/standing",
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      {
        label: "Display",
        path: "/settings/display",
      },
      {
        label: "Appearance",
        path: "/settings/appearance",
      },
      {
        label: "Preferences",
        path: "/settings/preferences",
      },
    ],
  },
  {
    label: "Create",
    icon: FolderPlus,
    children: [
      {
        label: "Article",
        path: "/create/article",
      },
      {
        label: "Document",
        path: "/create/document",
      },
      {
        label: "Video",
        path: "/create/video",
      },
      {
        label: "Presentation",
        path: "/create/presentation",
      },
    ],
  },
  {
    label: "Profile",
    icon: User,
    children: [
      {
        label: "Avatar",
        path: "/profile/avatar",
      },
      {
        label: "Theme",
        path: "/profile/theme",
      },
    ],
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    label: "Products",
    icon: ShoppingCart,
    path: "/products",
  },
  {
    label: "Account",
    icon: Lock,
    path: "/account",
  },
  {
    label: "Playground",
    icon: MonitorSmartphone,
    path: "/playground",
  },
];
