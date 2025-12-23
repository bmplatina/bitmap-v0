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
    items: [
      {
        title: "Bitmap",
        icon: <Home className="h-5 w-5" />,
        appIcon: Home,
        href: "/",
        bRequireLogin: false,
      },
      {
        title: "Bitmap App",
        icon: <Download className="h-5 w-5" />,
        appIcon: Download,
        href: "/about",
        bRequireLogin: false,
      },
      {
        title: "Bitmap Developer",
        icon: <Code className="h-5 w-5" />,
        appIcon: Code,
        href: "//developer.prodbybitmap.com",
        bRequireLogin: false,
      },
      {
        title: "Bitmap YouTube",
        icon: <TvMinimalPlay className="h-5 w-5" />,
        appIcon: TvMinimalPlay,
        href: "//youtube.com/@prodbybitmap",
        bRequireLogin: false,
      },
      {
        title: "Bitmap Wiki",
        icon: <BookOpen className="h-5 w-5" />,
        appIcon: BookOpen,
        href: "//wiki.prodbybitmap.com",
        bRequireLogin: false,
      },
    ],
  },
  {
    title: "Bitmap Store",
    items: [
      {
        title: "Games",
        icon: <GamepadIcon className="h-5 w-5" />,
        appIcon: GamepadIcon,
        href: "/games",
        bRequireLogin: false,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Register New Game",
        icon: <PlusCircle className="h-5 w-5" />,
        appIcon: PlusCircle,
        href: "/games/submit",
        bRequireLogin: true,
      },
      {
        title: "Pending Games",
        icon: <Clock className="h-5 w-5" />,
        appIcon: Clock,
        href: "/games/pending",
        bRequireLogin: true,
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
        bRequireLogin: false,
      },
      {
        title: "Settings",
        icon: <Settings className="h-5 w-5" />,
        appIcon: Settings,
        href: "/settings",
        bRequireLogin: false,
      },
    ],
  },
];
