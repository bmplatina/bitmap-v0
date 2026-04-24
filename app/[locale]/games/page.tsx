import type { GameList } from "@/lib/types";
// import GameCardCollection from "@/components/games/game-card-collection";
import { Box, Skeleton, Tabs, Text } from "@radix-ui/themes";
import { getGames } from "@/lib/games";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import GameCard from "@/components/games/game-card";

export default async function GamesPage() {
  // 서버 컴포넌트에서 직접 데이터 가져오기
  const allGames: GameList[] = await getGames("all");
  const t = await getTranslations("GamesView");

  return (
    <Tabs.Root defaultValue="released">
      <Tabs.List className="sticky top-0 z-10 bg-background border-b-0">
        <Tabs.Trigger value="all">{t("all")}</Tabs.Trigger>
        <Tabs.Trigger value="released">{t("released")}</Tabs.Trigger>
        <Tabs.Trigger value="pending">{t("pending")}</Tabs.Trigger>
      </Tabs.List>

      <Box pt="3">
        <Tabs.Content value="released">
          {/* <GameCardCollection
            games={allGames.filter((game) => game.isApproved)}
          /> */}
          <GameCardCollection>
            {allGames.map((game) => {
              if (!!game.isApproved)
                return (
                  <Suspense key={game.gameId} fallback={<GameCardSkeleton />}>
                    <GameCard game={game} />
                  </Suspense>
                );
            })}
          </GameCardCollection>
        </Tabs.Content>

        <Tabs.Content value="pending">
          <GameCardCollection>
            {allGames.map((game) => {
              if (!!!game.isApproved)
                return (
                  <Suspense key={game.gameId} fallback={<GameCardSkeleton />}>
                    <GameCard game={game} />
                  </Suspense>
                );
            })}
          </GameCardCollection>
        </Tabs.Content>

        <Tabs.Content value="all">
          <GameCardCollection>
            {allGames.map((game) => (
              <Suspense key={game.gameId} fallback={<GameCardSkeleton />}>
                <GameCard game={game} />
              </Suspense>
            ))}
          </GameCardCollection>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}

export async function GameCardCollection({
  children,
}: {
  children?: React.ReactNode;
}) {
  const t = await getTranslations("GamesView");

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">{t("explore")}</h1>

      {children ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {children}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            현재 사용 가능한 게임이 없습니다.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            게임 데이터를 불러오는 중 문제가 발생했거나 등록된 게임이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

// 로딩 중 표시할 스켈레톤 UI
function GameCardSkeleton() {
  return (
    <div className="overflow-hidden flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow">
      <div className="relative aspect-[1/1.414] w-full bg-muted animate-pulse" />
      <div className="p-4 flex-1">
        <Skeleton className="h-6 bg-muted rounded w-3/4 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-4 bg-muted rounded w-1/2" />
          <Skeleton className="h-4 bg-muted rounded w-2/3" />
          <Skeleton className="h-4 bg-muted rounded w-1/3" />
          <Skeleton className="h-4 bg-muted rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}
