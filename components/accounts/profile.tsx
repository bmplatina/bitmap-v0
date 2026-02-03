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

  const { logout, bIsEmailVerified, bIsAdmin } = useAuth();

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
            {bIsAdmin && (
              <Button size="3" asChild variant="soft">
                <Link href="/admin">{t("admin-menu")}</Link>
              </Button>
            )}
            <Button size="3" onClick={logout} color="red">
              {t("logout")}
            </Button>
          </Flex>
        </CardContent>
      </Card>
      <EmailVerificationDialog
        open={bIsVerifyClicked}
        openHandle={setVerificationClicked}
      />
    </Flex>
  );
}

interface ProfileSampleProps {
  username?: string;
  email?: string;
  bIsAdmin?: boolean;
  bIsDeveloper?: boolean;
  bIsTeammate?: boolean;
  bIsEmailVerified?: boolean;
  avatarUri?: string;
}

function ProfileList({
  username = "",
  email = "",
  bIsAdmin = false,
  bIsDeveloper = false,
  bIsTeammate = false,
  bIsEmailVerified = false,
  avatarUri = "",
}: ProfileSampleProps) {
  const t = useTranslations("Authentication");

  const {
    username: authUsername,
    email: authEmail,
    bIsAdmin: authIsAdmin,
    bIsDeveloper: authIsDeveloper,
    bIsTeammate: authIsTeammate,
    bIsEmailVerified: authIsEmailVerified,
    avatarUri: authAvatarUri,
    isLoading,
    bIsLoggedIn,
  } = useAuth();

  const [displayedUsername, setDisplayedUsername] = useState("");
  const [displayedEmail, setDisplayedEmail] = useState("");
  const [displayedIsAdmin, setDisplayedIsAdmin] = useState(false);
  const [displayedIsDeveloper, setDisplayedIsDeveloper] = useState(false);
  const [displayedIsTeammate, setDisplayedIsTeammate] = useState(false);
  const [displayedIsEmailVerified, setDisplayedIsEmailVerified] =
    useState(false);
  const [displayedAvatarUri, setDisplayedAvatarUri] = useState("");

  useEffect(
    function () {
      if (!isLoading) {
        setDisplayedUsername(bIsLoggedIn ? authUsername : username);
        setDisplayedEmail(bIsLoggedIn ? authEmail : email);
        setDisplayedIsAdmin(bIsLoggedIn ? authIsAdmin : bIsAdmin);
        setDisplayedIsDeveloper(bIsLoggedIn ? authIsDeveloper : bIsDeveloper);
        setDisplayedIsTeammate(bIsLoggedIn ? authIsTeammate : bIsTeammate);
        setDisplayedIsEmailVerified(
          bIsLoggedIn ? authIsEmailVerified : bIsEmailVerified,
        );
        setDisplayedAvatarUri(bIsLoggedIn ? authAvatarUri : avatarUri);
      }
    },
    [isLoading, bIsLoggedIn],
  );

  return (
    <Flex direction="column" gap="6" align="center">
      <Flex direction="column" gap="4" align="center">
        <Avatar
          src={
            imageUriRegExp.test(displayedAvatarUri)
              ? displayedAvatarUri
              : undefined
          }
          radius="full"
          size="6"
          fallback={displayedUsername.charAt(0).toUpperCase()}
        />
        <Text as="span" size="6" weight="bold">
          {displayedUsername}
        </Text>
      </Flex>

      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth="88px">{t("id")}</DataList.Label>
          <DataList.Value>{displayedUsername}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="88px">{t("email")}</DataList.Label>
          <DataList.Value>
            <Flex align="center" gap="2">
              <Code variant="ghost" className="break-all whitespace-pre-wrap">
                {displayedEmail}
              </Code>
            </Flex>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="88px">
            {t("teammate-account")}
          </DataList.Label>
          <DataList.Value>
            <Checkbox disabled checked={displayedIsTeammate} />
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="88px">
            {t("developer-account")}
          </DataList.Label>
          <DataList.Value>
            <Checkbox disabled checked={displayedIsDeveloper} />
          </DataList.Value>
        </DataList.Item>
        {!!displayedIsAdmin && (
          <DataList.Item>
            <DataList.Label minWidth="88px">
              {t("admin-account")}
            </DataList.Label>
            <DataList.Value>
              <Checkbox disabled defaultChecked />
            </DataList.Value>
          </DataList.Item>
        )}
        {!!!displayedIsEmailVerified && (
          <DataList.Item>
            <DataList.Label minWidth="88px">
              {t("email-verified")}
            </DataList.Label>
            <DataList.Value>
              <Checkbox disabled />
            </DataList.Value>
          </DataList.Item>
        )}
      </DataList.Root>
    </Flex>
  );
}

export { ProfilePopover, ProfileList };
