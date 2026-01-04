import { getTranslations } from "next-intl/server";
import { getGameById } from "@/lib/utils";
import { Metadata } from "@/lib/types";
import GameDetail from "@/components/game-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("GamesView");
  const game = await getGameById(id);

  if (!game) {
    return {
      title: `Bitmap Store: ${t("unknown-game")}`,
    };
  }

  return {
    title: `Bitmap Store: ${game.gameTitle}`,
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("GamesView");
  const game = await getGameById(id);

  if (!game) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <p className="text-xl mb-2">{t("unknown-game")}</p>
          <p className="text-sm text-muted-foreground">{t("unknown-game")}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <GameDetail game={game} bIsPending={false}></GameDetail>
    </div>
  );
}
