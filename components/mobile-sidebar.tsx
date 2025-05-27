"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, GamepadIcon, PlusCircle, Clock, User, Settings } from "lucide-react"
import { cn } from "../lib/utils"

const sidebarItems = [
    {
        title: "Main",
        items: [
            {
                title: "Home",
                icon: <Home className="h-5 w-5" />,
                href: "/",
            },
            {
                title: "Games",
                icon: <GamepadIcon className="h-5 w-5" />,
                href: "/games",
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                title: "Register New Game",
                icon: <PlusCircle className="h-5 w-5" />,
                href: "/register-game",
            },
            {
                title: "Pending Games",
                icon: <Clock className="h-5 w-5" />,
                href: "/pending-games",
            },
        ],
    },
    {
        title: "User",
        items: [
            {
                title: "Account",
                icon: <User className="h-5 w-5" />,
                href: "/account",
            },
            {
                title: "Settings",
                icon: <Settings className="h-5 w-5" />,
                href: "/settings",
            },
        ],
    },
]

interface MobileSidebarProps {
    onItemClick?: () => void
}

export function MobileSidebar({ onItemClick }: MobileSidebarProps) {
    const pathname = usePathname()

    const handleItemClick = () => {
        if (onItemClick) {
            onItemClick()
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-4">
            {sidebarItems.map((section) => (
                <div key={section.title} className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">{section.title}</h3>
                    <div className="space-y-1">
                        {section.items.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={handleItemClick}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                                )}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
