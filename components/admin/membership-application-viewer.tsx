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

interface MembershipApplicationProps {
  content: MembershipApplies;
}

export default function MembershipApplicationViewer({
  content,
}: MembershipApplicationProps) {
  const t = useTranslations("BitmapTeammate");
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
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
                <Text as="p">{}</Text>
                <TextField.Root
                  placeholder={t("name")}
                  value={content.name}
                  disabled
                >
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
                <TextField.Root
                  placeholder={t("alias")}
                  value={content.alias}
                  disabled
                >
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
                <TextField.Root
                  placeholder={t("age")}
                  type="number"
                  min="17"
                  value={content.age}
                  disabled
                >
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
                <TextArea
                  placeholder={t("introduction")}
                  resize="vertical"
                  value={content.introduction}
                  disabled
                />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("motivation")}
                </Text>
                <TextArea
                  placeholder={t("motivation")}
                  resize="vertical"
                  value={content.motivation}
                  disabled
                />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("affiliation")}
                </Text>
                <TextArea
                  placeholder={t("affiliation")}
                  value={content.affiliate}
                  disabled
                />
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
                <CheckboxGroup.Root
                  name="Working Fields"
                  value={content.field}
                  disabled
                >
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
                <Text as="label" weight="bold" size="5">
                  {t("prod-tools")}
                </Text>
                <TextArea
                  placeholder={t("prod-tools")}
                  resize="vertical"
                  value={content.prodTools}
                  disabled
                />
              </Flex>

              <Separator />

              <Flex direction="column" gap="2">
                <Text as="label" weight="bold" size="5">
                  {t("work-submission")}
                </Text>
                <Link
                  href={content.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text>{content.portfolio}</Text>
                </Link>
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
                <TextField.Root
                  placeholder={t("yt-channel-handle")}
                  value={content.youtubeHandle}
                  disabled
                >
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
                <TextField.Root
                  placeholder={t("position")}
                  value={content.position}
                  disabled
                >
                  <TextField.Slot>
                    <Building2 height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </Flex>
            </Flex>
          </CardContent>
        </Card>

        <Separator />

        <Button>{t("approve")}</Button>
        <Text color="red" as="p">
          {/* {t(submitFailMessage)} */}
        </Text>
      </Flex>
    </div>
  );
}
