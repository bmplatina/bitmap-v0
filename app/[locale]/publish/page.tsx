"use client";

import { useTranslations } from "next-intl";
import { Button } from "@radix-ui/themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { getGamesByUid } from "@/lib/games";
import GameListView from "@/components/games/game-listview";
import { Game } from "@/lib/types";

export default function SubmitGames() {
  const t = useTranslations("Publish");
  const router = useRouter();
  const { bIsLoggedIn, bIsDeveloper, bIsTeammate } = useAuth();

  const [games, setGames] = useState<Game[]>([]);

  useEffect(
    function () {
      if (!bIsLoggedIn || !bIsDeveloper || !bIsTeammate) {
        router.push("/auth");
      }
    },
    [bIsLoggedIn, bIsDeveloper, bIsTeammate]
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    getGamesByUid(token).then((data) => {
      setGames(data);
    });
  }, [games]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {bIsDeveloper && (
          <Card>
            <CardHeader>
              <CardTitle>{t("game")}</CardTitle>
            </CardHeader>
            <CardContent>
              {games.map((game) => (
                <GameListView key={game.gameId} game={game} bIsPending={true} />
              ))}
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
