"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Text,
  Checkbox,
  Flex,
  DataList,
  Code,
  Avatar,
} from "@radix-ui/themes";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useTranslations } from "next-intl";
import { pretendard, imageUriRegExp } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import EmailVerificationDialog from "./email-verification";

function ProfilePopover() {
  const t = useTranslations("Authentication");
  const [bIsVerifyClicked, setVerificationClicked] = useState<boolean>(false);

  const { logout, bIsEmailVerified } = useAuth();

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
          <ProfileList />
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

function ProfileList() {
  const t = useTranslations("Authentication");

  const {
    username,
    bIsDeveloper,
    bIsTeammate,
    avatarUri,
    email: emailResponse,
  } = useAuth();

  return (
    <Flex direction="column" gap="6" align="center">
      <Flex direction="column" gap="4" align="center">
        <Avatar
          src={imageUriRegExp.test(avatarUri) ? avatarUri : undefined}
          radius="full"
          size="6"
          fallback={username.charAt(0).toUpperCase()}
        />
        <Text as="span" size="6" weight="bold">
          {username}
        </Text>
      </Flex>

      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth="88px">{t("id")}</DataList.Label>
          <DataList.Value>{username}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="88px">{t("email")}</DataList.Label>
          <DataList.Value>
            <Flex align="center" gap="2">
              <Code variant="ghost" className="break-all whitespace-pre-wrap">
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
    </Flex>
  );
}

export { ProfilePopover, ProfileList };
