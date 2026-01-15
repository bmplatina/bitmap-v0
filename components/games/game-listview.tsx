"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Flex, IconButton } from "@radix-ui/themes";
import { Edit } from "lucide-react";
import { Badge } from "../ui/badge";
import type { Game } from "@/lib/types";

interface GameProp {
  game: Game;
  bIsPending: boolean;
}

export default function GameListView({ game, bIsPending }: GameProp) {
  const [href, setHref] = useState("");
  const t = useTranslations("Publish");

  return (
    <Flex align="center" gap="1">
      <Link
        key={game.gameId}
        href={`/games/${game.gameId}`}
        className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
      >
        <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-muted">
          <Image
            src={game.gameImageURL[0] || "/placeholder.svg?height=40&width=40"}
            alt={game.gameTitle}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{game.gameTitle}</p>
          <p className="text-xs text-muted-foreground truncate">
            {game.gameDeveloper}
          </p>
        </div>
      </Link>
      {bIsPending && (
        <Flex align="center" gap="3" className="pr-4">
          {game.isApproved && <Badge>{t("approved")}</Badge>}
          <IconButton radius="full" variant="ghost" asChild>
            <Link href={`/publish/games/edit/${game.gameId}`}>
              <Edit size={18} />
            </Link>
          </IconButton>
        </Flex>
      )}
    </Flex>
  );
}
