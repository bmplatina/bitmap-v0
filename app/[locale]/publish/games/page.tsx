"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Box, AlertDialog, Tabs, Flex } from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { getGameById } from "@/lib/games";
import { useAuth } from "@/lib/AuthContext";
import { useGameForm } from "@/lib/GamePublishContext";
import GameStoreViewEditor from "@/components/publish/games/game-storeview-editor";
import GameDetailEditor from "@/components/publish/games/game-detail-editor";
import GameAssetsUploader from "@/components/publish/games/game-assets-uploader";
import GamePublishSubmitter from "@/components/publish/games/game-publish-submitter";
import { useRouter } from "@/i18n/routing";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export default function SubmitGames() {
  const t = useTranslations("GameSubmit");
  const router = useRouter();

  const searchParams = useSearchParams();
  const { setGame, setIsEditingExisting, bIsEditingExisting } = useGameForm();

  const { bIsLoggedIn, bIsDeveloper } = useAuth();
  const isMobile = useIsMobile();
  const [ignoreMobileWarning, setIgnoreMobileWarning] =
    useState<boolean>(false);

  useEffect(
    function () {
      if (!bIsLoggedIn || !bIsDeveloper) {
        router.push("/auth");
      }
    },
    [bIsLoggedIn, bIsDeveloper]
  );

  useEffect(() => {
    const gameId = searchParams.get("edit");
    if (gameId) {
      getGameById(gameId).then((game) => {
        if (game) {
          setGame(game);
          setIsEditingExisting(true);
        }
      });
    }
  }, [searchParams]);

  return (
    <>
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
          <Tabs.Trigger value="submit">
            {bIsEditingExisting ? t("edit") : t("submit")}
          </Tabs.Trigger>
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
    </>
  );
}
