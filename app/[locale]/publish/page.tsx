"use client";

import { useTranslations } from "next-intl";
import { Button, Skeleton, Flex } from "@radix-ui/themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { getGamesByUid } from "@/lib/games";
import GameListView from "@/components/games/game-listview";
import { Game } from "@/lib/types";

export default function SubmitGames() {
  const t = useTranslations("Publish");
  const router = useRouter();
  const { bIsLoggedIn, bIsDeveloper, bIsTeammate } = useAuth();

  const [games, setGames] = useState<Game[]>([]);
  const [bIsLoading, setIsLoading] = useState(true);

  useEffect(
    function () {
      if (!bIsLoggedIn || !bIsDeveloper || !bIsTeammate) {
        router.push("/auth");
      }
    },
    [bIsLoggedIn, bIsDeveloper, bIsTeammate, router]
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    getGamesByUid(token)
      .then((data) => {
        setGames(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {bIsDeveloper && (
          <Card>
            <CardHeader>
              <CardTitle>{t("game")}</CardTitle>
            </CardHeader>
            <CardContent>
              {bIsLoading ? (
                <Flex direction="column" gap="4" py="2">
                  {[1, 2, 3].map((i) => (
                    <Flex key={i} align="center" gap="3" px="4">
                      <Skeleton width="40px" height="40px" />
                      <Flex direction="column" gap="1">
                        <Skeleton width="120px" height="16px" />
                        <Skeleton width="80px" height="12px" />
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              ) : games.length > 0 ? (
                games.map((game) => (
                  <GameListView
                    key={game.gameId}
                    game={game}
                    bIsPublishingMode={true}
                  />
                ))
              ) : (
                <p className="text-center py-6 text-muted-foreground text-sm">
                  등록된 게임이 없습니다.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/publish/games")}>
                {t("publish-new")}
              </Button>
            </CardFooter>
          </Card>
        )}

        {bIsTeammate && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t("project-file")}</CardTitle>
              </CardHeader>
              <CardContent>준비 중인 기능</CardContent>
              <CardFooter>
                <Button onClick={() => router.push("/publish/projectfiles")}>
                  {t("publish-new")}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("lecture")}</CardTitle>
              </CardHeader>
              <CardContent>준비 중인 기능</CardContent>
              <CardFooter>
                <Button onClick={() => router.push("/publish/lectures")}>
                  {t("publish-new")}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
