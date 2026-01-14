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
        <TabNav.Link href="/account" active={pathname === "/account"}>
          {t("general-info")}
        </TabNav.Link>
        <TabNav.Link href="/account/edit" active={pathname === "/account/edit"}>
          {t("edit")}
        </TabNav.Link>
        <TabNav.Link
          href="/account/settings"
          active={pathname === "/account/settings"}
        >
          {t("settings")}
        </TabNav.Link>
      </TabNav.Root>
      {bIsLoggedIn && children}
    </div>
  );
}
