"use client";

import { useEffect, useState } from "react";
import { Button, Checkbox, Flex, DataList, Code } from "@radix-ui/themes";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useTranslations } from "next-intl";
import { pretendard } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import EmailVerificationDialog from "./email-verification";

export default function ProfilePopover() {
  const t = useTranslations("Authentication");
  const [bIsVerifyClicked, setVerificationClicked] = useState<boolean>(false);

  const {
    logout,
    username,
    bIsDeveloper,
    bIsTeammate,
    email: emailResponse,
    bIsEmailVerified,
  } = useAuth();

  useEffect(() => {
    // bSetLoggedInState(localStorage.getItem("token") !== "");
  });

  return (
    <Flex
      direction="column"
      gap="4"
      className="w-full max-w-[85vw] md:max-w-md"
    >
      <Card className={`${pretendard.variable} font-sans`}>
        <CardHeader>
          <CardTitle>Bitmap ID</CardTitle>
        </CardHeader>
        <CardContent>
          <DataList.Root>
            <DataList.Item>
              <DataList.Label minWidth="88px">{t("id")}</DataList.Label>
              <DataList.Value>{username}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">{t("email")}</DataList.Label>
              <DataList.Value>
                <Flex align="center" gap="2">
                  <Code
                    variant="ghost"
                    className="break-all whitespace-pre-wrap"
                  >
                    {emailResponse}
                  </Code>
                </Flex>
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">
                {t("teammate-account")}
              </DataList.Label>
              <DataList.Value>
                <Checkbox disabled checked={bIsTeammate} />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">
                {t("developer-account")}
              </DataList.Label>
              <DataList.Value>
                <Checkbox disabled checked={bIsDeveloper} />
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
          <Flex direction="column" gap="2" className="mt-3">
            <Button size="3" asChild>
              <Link href="/account">{t("account-settings")}</Link>
            </Button>
            {!bIsEmailVerified && (
              <Button
                size="3"
                variant="outline"
                onClick={() => setVerificationClicked(true)}
              >
                {t("verify")}
              </Button>
            )}
            <Button size="3" onClick={logout} color="red">
              {t("logout")}
            </Button>
          </Flex>
        </CardContent>
      </Card>
      <EmailVerificationDialog open={bIsVerifyClicked} />
    </Flex>
  );
}
