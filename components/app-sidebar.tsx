"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, GamepadIcon, PlusCircle, Clock, User, Settings } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "./ui/sidebar"

const sidebarItems = [
    {
        title: "Main",
        items: [
            {
                title: "Home",
                icon: Home,
                href: "/",
            },
            {
                title: "Games",
                icon: GamepadIcon,
                href: "/games",
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                title: "Register New Game",
                icon: PlusCircle,
                href: "/register-game",
            },
            {
                title: "Pending Games",
                icon: Clock,
                href: "/pending-games",
            },
        ],
    },
    {
        title: "User",
        items: [
            {
                title: "Account",
                icon: User,
                href: "/account",
            },
            {
                title: "Settings",
                icon: Settings,
                href: "/settings",
            },
        ],
    },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar className="hidden md:flex">
            <SidebarContent>
                {sidebarItems.map((section) => (
                    <SidebarGroup key={section.title}>
                        <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={pathname === item.href}>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    )
}
