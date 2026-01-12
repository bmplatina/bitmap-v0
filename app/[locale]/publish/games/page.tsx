"use client";

import { useTranslations, useLocale } from "next-intl";
import GameStoreViewEditor from "@/components/publish/games/game-storeview-editor";
import { Box, AlertDialog, Tabs, Text, Flex } from "@radix-ui/themes";
import { useAuth } from "@/lib/AuthContext";
import { GamePublishProvider } from "@/lib/GamePublishContext";
import GameDetailEditor from "@/components/publish/games/game-detail-editor";
import GameAssetsUploader from "@/components/publish/games/game-assets-uploader";
import GamePublishSubmitter from "@/components/publish/games/game-publish-submitter";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export default function SubmitGames() {
  const t = useTranslations("GameSubmit");
  const router = useRouter();
  const { bIsLoggedIn, bIsDeveloper } = useAuth();
  const isMobile = useIsMobile();
  const [ignoreMobileWarning, setIgnoreMobileWarning] =
    useState<boolean>(false);

  useEffect(
    function () {
      if (!bIsLoggedIn || !bIsDeveloper) {
        router.push("/account");
      }
    },
    [bIsLoggedIn, bIsDeveloper]
  );

  return (
    <GamePublishProvider>
      <AlertDialog.Root open={isMobile && !ignoreMobileWarning}>
        <AlertDialog.Content>
          <AlertDialog.Title>{t("mobile-publish-warning")}</AlertDialog.Title>
          <AlertDialog.Description size="2">
            {t("mobile-publish-warning=desc")}
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Action>
              <Button variant="secondary" onClick={() => router.back()}>
                {t("go-back")}
              </Button>
            </AlertDialog.Action>
            <AlertDialog.Cancel>
              <Button
                variant="destructive"
                onClick={() => setIgnoreMobileWarning(true)}
              >
                {t("ignore-continue")}
              </Button>
            </AlertDialog.Cancel>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <Tabs.Root defaultValue="store-viewed-info">
        <Tabs.List className="sticky top-0 z-10 bg-background border-b-0">
          <Tabs.Trigger value="store-viewed-info">
            {t("store-viewed-info")}
          </Tabs.Trigger>
          <Tabs.Trigger value="detailed-info">
            {t("detailed-info")}
          </Tabs.Trigger>
          <Tabs.Trigger value="assets">{t("assets")}</Tabs.Trigger>
          <Tabs.Trigger value="submit">{t("submit")}</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="store-viewed-info">
            <GameStoreViewEditor />
          </Tabs.Content>

          <Tabs.Content value="detailed-info">
            <GameDetailEditor />
          </Tabs.Content>

          <Tabs.Content value="assets">
            <GameAssetsUploader />
          </Tabs.Content>
          <Tabs.Content value="submit">
            <GamePublishSubmitter />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </GamePublishProvider>
  );
}
