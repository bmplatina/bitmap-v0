import type {
  GameList,
  GameReleaseState,
  searchParamsPropsSSR,
} from "@/lib/types";
import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  TabNav,
  Text,
} from "@radix-ui/themes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getGames } from "@/lib/games";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import GameCard from "@/components/games/game-card";
import { z } from "zod";

const gamesSearchParamsSchema = z.object({
  state: z.enum(["all", "released", "pending"]).catch("released"),
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(0))
    .catch(0),
});

export default async function GamesPage({
  searchParams,
}: searchParamsPropsSSR) {
  const params = await searchParams;
  const { state, page } = gamesSearchParamsSchema.parse(params);

  // 서버 컴포넌트에서 직접 데이터 가져오기
  const games: GameList[] = await getGames(state, page);
  const nextGames: GameList[] = await getGames(state, page + 1);

  const t = await getTranslations("GamesView");

  return (
    <Flex direction="column" gap="3" justify="center">
      <TabNav.Root className="sticky top-0 z-10 bg-background border-b-0">
        <TabNav.Link href="/games?state=all" active={state === "all"}>
          {t("all")}
        </TabNav.Link>
        <TabNav.Link href="/games?state=released" active={state === "released"}>
          {t("released")}
        </TabNav.Link>
        <TabNav.Link href="/games?state=pending" active={state === "pending"}>
          {t("pending")}
        </TabNav.Link>
      </TabNav.Root>
      <Box pt="3">
        <GameCardCollection>
          {games.map((game) => (
            <Suspense key={game.gameId} fallback={<GameCardSkeleton />}>
              <GameCard game={game} />
            </Suspense>
          ))}
        </GameCardCollection>
      </Box>
      <Flex justify="center" align="center" gap="2">
        <IconButton variant="ghost" radius="full" disabled={page === 0}>
          {page === 0 ? (
            <ChevronLeft />
          ) : (
            <Link href={`/games?state=${state}&page=${page - 1}`}>
              <ChevronLeft />
            </Link>
          )}
        </IconButton>
        <Text as="p" weight="bold">
          {page + 1}
        </Text>
        <IconButton
          variant="ghost"
          radius="full"
          disabled={nextGames.length === 0}
        >
          {nextGames.length === 0 ? (
            <ChevronRight />
          ) : (
            <Link href={`/games?state=${state}&page=${page + 1}`}>
              <ChevronRight />
            </Link>
          )}
        </IconButton>
      </Flex>
    </Flex>
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
