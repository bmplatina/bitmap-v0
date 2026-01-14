"use client";

import type React from "react";
import { useEffect } from "react";
import { TabNav } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/AuthContext";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("Authentication");
  const pathname = usePathname();
  const router = useRouter();
  const { bIsLoggedIn } = useAuth();

  useEffect(() => {
    if (!bIsLoggedIn) {
      // Redirect or perform some action if not logged in
      router.push("/auth");
    }
  }, [bIsLoggedIn]);

  return (
    <div>
      <TabNav.Root className="sticky top-0 z-10 bg-background border-b-0">
        <TabNav.Link asChild active={pathname === "/account"}>
          <Link href="/account">{t("general-info")}</Link>
        </TabNav.Link>
        <TabNav.Link asChild active={pathname === "/account/edit"}>
          <Link href="/account/edit">{t("edit")}</Link>
        </TabNav.Link>
        <TabNav.Link asChild active={pathname === "/account/settings"}>
          <Link href="/account/settings">{t("settings")}</Link>
        </TabNav.Link>
      </TabNav.Root>
      {bIsLoggedIn && children}
    </div>
  );
}
