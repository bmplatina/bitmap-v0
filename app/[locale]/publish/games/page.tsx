"use client";

import { useTranslations, useLocale } from "next-intl";
import GameStoreViewEditor from "@/components/publish/games/game-storeview-editor";
import { Box, Tabs, Text } from "@radix-ui/themes";
import {} from "lucide-react";
import { GamePublishProvider } from "@/lib/GamePublishContext";
import GameDetailEditor from "@/components/publish/games/game-detail-editor";

export default function SubmitGames() {
  const t = useTranslations("GameSubmit");

  return (
    <GamePublishProvider>
      <Tabs.Root defaultValue="store-viewed-info">
        <Tabs.List>
          <Tabs.Trigger value="store-viewed-info">
            {t("store-viewed-info")}
          </Tabs.Trigger>
          <Tabs.Trigger value="detailed-info">
            {t("detailed-info")}
          </Tabs.Trigger>
          <Tabs.Trigger value="media">{t("media")}</Tabs.Trigger>
          <Tabs.Trigger value="preview">{t("preview")}</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="store-viewed-info">
            <GameStoreViewEditor />
          </Tabs.Content>

          <Tabs.Content value="detailed-info">
            <GameDetailEditor />
          </Tabs.Content>

          <Tabs.Content value="media">
            <Text size="2">
              Edit your profile or update contact information.
            </Text>
          </Tabs.Content>
          <Tabs.Content value="preview">
            <Text size="2">
              Edit your profile or update contact information.
            </Text>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </GamePublishProvider>
  );
}
