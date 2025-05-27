import { BookOpen, Code, Home, GamepadIcon, PlusCircle, Clock, User, Settings, TvMinimalPlay } from "lucide-react";

export const sidebarItems = [
    {
        title: "Main",
        items: [
            {
                title: "Home",
                icon: <Home className="h-5 w-5" />,
                appIcon: Home,
                href: "/"
            },
            {
                title: "Bitmap Developer",
                icon: <Code className="h-5 w-5" />,
                appIcon: Code,
                href: "//developer.prodbybitmap.com"
            },
            {
                title: "Bitmap YouTube",
                icon: <TvMinimalPlay className="h-5 w-5" />,
                appIcon: TvMinimalPlay,
                href: "//youtube.com/@prodbybitmap"
            },
            {
                title: "Bitmap Wiki",
                icon: <BookOpen className="h-5 w-5" />,
                appIcon: BookOpen,
                href: "//wiki.prodbybitmap.com"
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
                href: "/games"
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
                href: "/register-game"
            },
            {
                title: "Pending Games",
                icon: <Clock className="h-5 w-5" />,
                appIcon: Clock,
                href: "/pending-games"
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
                href: "/account"
            },
            {
                title: "Settings",
                icon: <Settings className="h-5 w-5" />,
                appIcon: Settings,
                href: "/settings"
            },
        ],
    },
];
