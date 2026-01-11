"use client";

import { useTranslations, useLocale } from "next-intl";
import GameStoreViewEditor from "@/components/publish/games/game-storeview-editor";
import { Box, Tabs, Text } from "@radix-ui/themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/AuthContext";
import { GamePublishProvider } from "@/lib/GamePublishContext";
import GameDetailEditor from "@/components/publish/games/game-detail-editor";
import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export default function SubmitGames() {
  const t = useTranslations("GameSubmit");
  const router = useRouter();
  const { bIsLoggedIn, bIsDeveloper } = useAuth();
  const isMobile = useIsMobile();

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
      {/* <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("mobile-publish-warning")}</DialogTitle>
            <DialogDescription>
              {t("mobile-publish-warning=desc")}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
        <DialogFooter>
          <Button variant="secondary" onClick={() => router.back()}>
            {t("go-back")}
          </Button>
          <DialogTrigger asChild>
            <Button>{t("ignore-continue")}</Button>
          </DialogTrigger>
        </DialogFooter>
      </Dialog> */}
      <Tabs.Root defaultValue="store-viewed-info">
        <Tabs.List>
          <Tabs.Trigger value="store-viewed-info">
            {t("store-viewed-info")}
          </Tabs.Trigger>
          <Tabs.Trigger value="detailed-info">
            {t("detailed-info")}
          </Tabs.Trigger>
          <Tabs.Trigger value="media">{t("media")}</Tabs.Trigger>
          <Tabs.Trigger value="submit">{t("submit")}</Tabs.Trigger>
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
          <Tabs.Content value="submit">
            <Text size="2">
              Edit your profile or update contact information.
            </Text>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </GamePublishProvider>
  );
}
