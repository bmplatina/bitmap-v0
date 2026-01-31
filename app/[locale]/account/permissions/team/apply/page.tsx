"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import {
  CheckboxGroup,
  Button,
  Flex,
  Spinner,
  Text,
  TextField,
  TextArea,
} from "@radix-ui/themes";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link as LinkIcon, User, Youtube, Building2 } from "lucide-react";
import type { MembershipApplies } from "@/lib/types";
import { applyMembership } from "@/lib/permissions";
import { useAuth } from "@/lib/AuthContext";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import MultiLineText from "@/components/common/multi-line-text";
import PreventExit from "@/components/common/prevent-exit";

export default function BitmapApply() {
  const t = useTranslations("BitmapTeammate");
  const router = useRouter();
  const locale = useLocale();

  const { isLoading, bIsTeammate, uid } = useAuth();

  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [age, setAge] = useState(17);
  const [introduction, setIntroduction] = useState("");
  const [motivation, setMotivation] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [workingField, setWorkingField] = useState<Array<number>>([0]);
  const [prodTools, setProdTools] = useState("");
  const [workSubmission, setWorkSubmission] = useState("");
  const [ytChannelHandle, setYtChannelHandle] = useState("");
  const [position, setPosition] = useState("");
  const [avatarUri, setAvatarUri] = useState("");

  const [bIsSubmitting, setIsSubmitting] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  /**
   * @todo avatarUri uid에서 연동해오기
   * @todo MembershipApplies Omit해서 id와 isApproved 제거
   */
  async function handleApplication() {
    try {
      const form: MembershipApplies = {
        id: 10000,
        name,
        alias,
        age,
        introduction,
        motivation,
        affiliate: affiliation,
        field: workingField,
        prodTools,
        portfolio: workSubmission,
        youtubeHandle: ytChannelHandle,
        position,
        uid,
        locale,
        avatarUri,
        isApproved: false,
      };
      await applyMembership(form);
    } catch (error: any) {
    } finally {
    }
  }

  useEffect(
    function () {
      if (!isLoading) {
        if (bIsTeammate) {
          router.push("/account/permissions");
        }
      }
    },
    [isLoading, bIsTeammate],
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PreventExit />
      <Flex direction="column" gap="5">
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
            <Flex direction="column" gap="5">
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
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
                <Text as="label" weight="bold" size="5">
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
                <Text as="label" weight="bold" size="5">
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
            <Flex direction="column" gap="5">
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("introduction")}
                </Text>
                <TextArea placeholder={t("introduction")} resize="vertical" />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("motivation")}
                </Text>
                <TextArea placeholder={t("motivation")} resize="vertical" />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
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
            <Flex direction="column" gap="5">
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("working-field")}
                </Text>
                <CheckboxGroup.Root name="Working Fields">
                  <CheckboxGroup.Item value="1">
                    {t("vp-post")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="2">
                    {t("vp-mograph")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="5">
                    {t("illustration")}
                  </CheckboxGroup.Item>
                  <CheckboxGroup.Item value="5">
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
                <Text as="label" weight="bold" size="5">
                  {t("prod-tools")}
                </Text>
                <TextArea placeholder={t("prod-tools")} resize="vertical" />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("work-submission")}
                </Text>
                <TextField.Root
                  placeholder={t("work-submission")}
                  type="number"
                  min="17"
                >
                  <TextField.Slot>
                    <LinkIcon height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Flex>
            </Flex>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>{t("bitmap-about-expose")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Flex direction="column" gap="5">
              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("yt-channel-handle")}
                </Text>
                <Text>{t("yt-channel-handle-desc")}</Text>
                <TextField.Root placeholder={t("yt-channel-handle")}>
                  <TextField.Slot>
                    <Youtube height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("position")}
                </Text>
                <TextField.Root placeholder={t("position")}>
                  <TextField.Slot>
                    <Building2 height="16" width="16" />
                  </TextField.Slot>
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
