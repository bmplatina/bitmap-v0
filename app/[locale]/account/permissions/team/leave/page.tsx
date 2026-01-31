"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/AuthContext";
import {
  Button,
  Flex,
  TextField,
  Text,
  CheckboxGroup,
  TextArea,
} from "@radix-ui/themes";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PreventExit from "@/components/common/prevent-exit";
import MultiLineText from "@/components/common/multi-line-text";
import { useTranslations } from "next-intl";
import { User } from "lucide-react";

export default function BitmapQuit() {
  const router = useRouter();
  const t = useTranslations("BitmapTeammate");
  const { isLoading, bIsTeammate } = useAuth();

  useEffect(
    function () {
      if (!isLoading) {
        if (!bIsTeammate) {
          router.push("/account/permissions");
        }
      }
    },
    [isLoading, bIsTeammate],
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PreventExit />
      <Flex direction="column" gap="3">
        <MultiLineText size="7" as="p" weight="bold">
          {t("apply-title")}
        </MultiLineText>
        <MultiLineText as="span" color="gray">
          BMP_JOINREVISION_260129_v08
        </MultiLineText>
        <Card>
          <CardHeader>
            <CardTitle>{t("personal-info")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("name")}
                </Text>
                <TextField.Root placeholder={t("name")}>
                  <TextField.Slot>
                    <User height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Flex>
              <Separator />
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("alias")}
                </Text>
                <TextField.Root placeholder={t("alias")}>
                  <TextField.Slot>
                    <User height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Flex>
              <Separator />
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("age")}
                </Text>
                <TextField.Root placeholder={t("age")} type="number" min="17">
                  <TextField.Slot>
                    <User height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Flex>
            </Flex>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>{t("self-promotion")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("introduction")}
                </Text>
                <TextArea placeholder={t("introduction")} resize="vertical" />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("motivation")}
                </Text>
                <TextArea placeholder={t("motivation")} resize="vertical" />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("affiliation")}
                </Text>
                <TextArea placeholder={t("affiliation")} />
              </Flex>
            </Flex>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>{t("field")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("working-field")}
                </Text>
                <CheckboxGroup.Root name="Working Fields">
                  <CheckboxGroup.Item value="1">
                    {t("vp-post")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="2">
                    {t("vp-mograph")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="3">
                    {t("illustration")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="4">
                    {t("music-produce")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="5">
                    {t("dev-web")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="6">
                    {t("dev-app")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="7">
                    {t("dev-game")}
                  </CheckboxGroup.Item>
                </CheckboxGroup.Root>
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("prod-tools")}
                </Text>
                <TextArea placeholder={t("prod-tools")} resize="vertical" />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold">
                  {t("work-submission")}
                </Text>
                <TextField.Root
                  placeholder={t("work-submission")}
                  type="number"
                  min="17"
                >
                  <TextField.Slot></TextField.Slot>
                </TextField.Root>
              </Flex>
            </Flex>
          </CardContent>
        </Card>

        <Separator />

        <Button>{t("submit")}</Button>
      </Flex>
    </div>
  );
}
