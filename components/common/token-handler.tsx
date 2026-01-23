"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import EmailVerificationDialog from "@/components/accounts/email-verification";

export default function TokenHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, logout, bIsEmailVerified, bIsLoggedIn, username } = useAuth();
  const t = useTranslations("Authentication");
  const [bIsVerificationClicked, setVerificationClicked] =
    useState<boolean>(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      login(token);
      router.replace("/");
    }
  }, [searchParams, router, login]);

  if (!bIsEmailVerified && bIsLoggedIn) {
    return (
      <div className="h-12 bg-background border-b flex items-center px-4 w-full relative z-50">
        <div className="mr-auto text-sm md:text-base">
          <Text weight="bold">{username}</Text>
          <Text wrap="pretty">{t("email-verification-incomplete-top")}</Text>
        </div>

        <Flex gap="2">
          <Button onClick={() => setVerificationClicked(true)} radius="full">
            <Text>{t("verify")}</Text>
          </Button>
          <div className="hidden md:block">
            <Button onClick={() => logout()} radius="full" variant="outline">
              <Text>{t("logout")}</Text>
            </Button>
          </div>
        </Flex>

        <EmailVerificationDialog open={bIsVerificationClicked} />
      </div>
    );
  }
  return null;
}
