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
      router.push("/account");
    }
  }, [bIsLoggedIn]);

  return (
    <div>
      <TabNav.Root className="sticky top-0 z-10 bg-background border-b-0">
        <TabNav.Link
          href="/account/profile"
          active={pathname === "/account/profile"}
        >
          {t("general-info")}
        </TabNav.Link>
        <TabNav.Link
          href="/account/profile/edit"
          active={pathname === "/account/profile/edit"}
        >
          {t("edit")}
        </TabNav.Link>
      </TabNav.Root>
      {bIsLoggedIn && children}
    </div>
  );
}
