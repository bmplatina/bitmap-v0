"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { sidebarItems } from "@/lib/sidebar-items";
import { useTranslations } from "next-intl";

interface MobileSidebarProps {
  onItemClick?: () => void;
}

export function MobileSidebar({ onItemClick }: MobileSidebarProps) {
  const pathname = usePathname();
  const { bIsLoggedIn } = useAuth();
  const t = useTranslations("Sidebar");

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {sidebarItems.map((section) => {
        if (section.bRequireLogin && !bIsLoggedIn) {
          return null;
        }

        return (
          <div key={section.title} className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              {t(section.title)}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={handleItemClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {t(item.title)}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
