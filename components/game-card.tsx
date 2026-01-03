import type { Game } from "../lib/types";
import { getLocalizedString, formatDate } from "../lib/utils";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Code, Tag } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

interface GameCardProps {
  game: Game;
  linkPrefix?: string; // 링크 프리픽스 (기본값: "/games")
}

export default async function GameCard({
  game,
  linkPrefix = "/games",
}: GameCardProps) {
  const locale = await getLocale();
  const t = await getTranslations("GamesView");

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
      <Link href={`${linkPrefix}/${game.gameId}`} className="block">
        <div className="relative aspect-[1/1.414] w-full cursor-pointer hover:opacity-90 transition-opacity">
          <Image
            src={game.gameImageURL || "/placeholder.svg?height=400&width=283"}
            alt={game.gameTitle}
            fill
            className="object-cover"
            priority
          />
          {game.isEarlyAccess === 1 && (
            <Badge className="absolute top-2 right-2 bg-amber-500">
              {t("early-access")}
            </Badge>
          )}
          {linkPrefix === "/games/pending" && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              {t("pending")}
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="flex-1 p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">
          {game.gameTitle}
        </h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span>{game.gameDeveloper}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{getLocalizedString(locale, game.gameGenre)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(locale, game.gameReleasedDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
