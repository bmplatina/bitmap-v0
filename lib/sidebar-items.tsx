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
    title: "Bitmap",
    bRequireLogin: false,
    items: [
      {
        title: "Bitmap",
        icon: <Home className="h-5 w-5" />,
        appIcon: Home,
        href: "/",
      },
      {
        title: "Bitmap App",
        icon: <Download className="h-5 w-5" />,
        appIcon: Download,
        href: "/about",
      },
      {
        title: "Bitmap Developer",
        icon: <Code className="h-5 w-5" />,
        appIcon: Code,
        href: "//developer.prodbybitmap.com",
      },
      {
        title: "Bitmap YouTube",
        icon: <TvMinimalPlay className="h-5 w-5" />,
        appIcon: TvMinimalPlay,
        href: "//youtube.com/@prodbybitmap",
      },
      {
        title: "Bitmap Wiki",
        icon: <BookOpen className="h-5 w-5" />,
        appIcon: BookOpen,
        href: "//wiki.prodbybitmap.com",
      },
    ],
  },
  {
    title: "Bitmap Store",
    bRequireLogin: false,
    items: [
      {
        title: "Games",
        icon: <GamepadIcon className="h-5 w-5" />,
        appIcon: GamepadIcon,
        href: "/games",
      },
    ],
  },
  {
    title: "Management",
    bRequireLogin: true,
    items: [
      {
        title: "Register New Game",
        icon: <PlusCircle className="h-5 w-5" />,
        appIcon: PlusCircle,
        href: "/games/submit",
      },
      {
        title: "Pending Games",
        icon: <Clock className="h-5 w-5" />,
        appIcon: Clock,
        href: "/games/pending",
      },
    ],
  },
  {
    title: "User",
    items: [
      {
        title: "Account",
        icon: <User className="h-5 w-5" />,
        appIcon: User,
        href: "/account",
      },
      {
        title: "Settings",
        icon: <Settings className="h-5 w-5" />,
        appIcon: Settings,
        href: "/settings",
      },
    ],
  },
];
