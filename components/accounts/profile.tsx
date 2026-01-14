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

export default function ProfilePopover() {
  const t = useTranslations("Authentication");

  const {
    logout,
    username,
    bIsDeveloper,
    bIsTeammate,
    email: emailResponse,
  } = useAuth();

  useEffect(() => {
    // bSetLoggedInState(localStorage.getItem("token") !== "");
  });

  return (
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
  );
}
