"use client";

import { useEffect, type KeyboardEvent } from "react";
import {
  Checkbox,
  Button,
  Flex,
  Spinner,
  Text,
  DataList,
  Code,
} from "@radix-ui/themes";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useTranslations } from "next-intl";

export default function AccountPage() {
  const t = useTranslations("Authentication");

  const {
    bIsLoggedIn,
    logout,
    username,
    bIsDeveloper,
    bIsTeammate,
    email: emailResponse,
  } = useAuth();

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      // handleLogin();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-6 text-center">
      {!bIsLoggedIn && (
        <div>
          <h1 className="text-4xl font-bold mb-6">Bitmap ID</h1>
          <Text as="p" size="5" className="mb-8 max-w-2xl">
            {t("bitmap-id-desc")}
          </Text>
        </div>
      )}
      <Flex direction="column" gap="4" className="w-full max-w-md">
        <Card>
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
                    <Code variant="ghost">{emailResponse}</Code>
                  </Flex>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">
                  {t("teammate-account")}
                </DataList.Label>
                <DataList.Value>
                  <Text>{bIsTeammate ? t("teammate-account") : "N/A"}</Text>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">
                  {t("developer-account")}
                </DataList.Label>
                <DataList.Value>
                  <Text>{bIsDeveloper ? t("developer-account") : "N/A"}</Text>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
            <Flex direction="column" gap="2" className="mt-3">
              <Button size="3" onClick={logout}>
                {t("logout")}
              </Button>
            </Flex>
          </CardContent>
        </Card>
      </Flex>
    </div>
  );
}
