"use client";

import { useEffect, useState } from "react";
import { Button, Spinner, Text } from "@radix-ui/themes";
import { getGameById } from "@/lib/games";
import type { Game } from "@/lib/types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Download } from "lucide-react";

interface GameProps {
  gameId: string;
}

export default function BitmapAppRedirector({ gameId }: GameProps) {
  const t = useTranslations("Sidebar");
  const [game, setGame] = useState<Game | null>(null);
  const [bIsFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    async function fetchGame() {
      try {
        setIsFetching(true);
        const game = await getGameById(gameId);
        setGame(game);
      } catch (err: any) {
      } finally {
        setIsFetching(false);
      }
    }

    fetchGame();
    if (gameId) window.location.href = `bitmap://games/${gameId}`;
  }, [gameId]);

  if (!gameId) return null;

  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      asChild
      disabled={bIsFetching}
    >
      <Link
        href={`bitmap://games/${gameId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {bIsFetching ? (
          <Spinner />
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            <Text>Bitmap App에서 {game?.gameTitle} 보기</Text>
          </>
        )}
      </Link>
    </Button>
  );
}
