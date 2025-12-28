import {
  BookOpen,
  Code,
  Download,
  Home,
  GamepadIcon,
  PlusCircle,
  Clock,
  User,
  Settings,
  TvMinimalPlay,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "bitmap",
    bRequireLogin: false,
    items: [
      {
        title: "bitmap",
        icon: <Home className="h-5 w-5" />,
        appIcon: Home,
        href: "/",
      },
      {
        title: "bitmap-app",
        icon: <Download className="h-5 w-5" />,
        appIcon: Download,
        href: "/about",
      },
      {
        title: "bitmap-developer",
        icon: <Code className="h-5 w-5" />,
        appIcon: Code,
        href: "//developer.prodbybitmap.com",
      },
      {
        title: "bitmap-youtube",
        icon: <TvMinimalPlay className="h-5 w-5" />,
        appIcon: TvMinimalPlay,
        href: "//youtube.com/@prodbybitmap",
      },
      {
        title: "bitmap-wiki",
        icon: <BookOpen className="h-5 w-5" />,
        appIcon: BookOpen,
        href: "//wiki.prodbybitmap.com",
      },
    ],
  },
  {
    title: "bitmap-store",
    bRequireLogin: false,
    items: [
      {
        title: "games",
        icon: <GamepadIcon className="h-5 w-5" />,
        appIcon: GamepadIcon,
        href: "/games",
      },
    ],
  },
  {
    title: "publish",
    bRequireLogin: true,
    items: [
      {
        title: "game-submit",
        icon: <PlusCircle className="h-5 w-5" />,
        appIcon: PlusCircle,
        href: "/games/submit",
      },
      {
        title: "games-pending",
        icon: <Clock className="h-5 w-5" />,
        appIcon: Clock,
        href: "/games/pending",
      },
    ],
  },
  {
    title: "accounts",
    items: [
      {
        title: "accounts",
        icon: <User className="h-5 w-5" />,
        appIcon: User,
        href: "/account",
      },
      {
        title: "settings",
        icon: <Settings className="h-5 w-5" />,
        appIcon: Settings,
        href: "/settings",
      },
    ],
  },
];
