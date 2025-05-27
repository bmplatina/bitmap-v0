import { Suspense } from "react"
import type { Game } from "@/lib/types"
import GameCard from "@/components/game-card"
import { sampleGames } from "@/lib/sample-data"

// 샘플 데이터를 사용하는 함수 - 서버 컴포넌트에서만 호출
function getGames(): Game[] {
  return sampleGames
}

export default function GamesPage() {
  // 서버 컴포넌트에서 직접 데이터 가져오기
  const games = getGames()

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">게임 라이브러리</h1>

      {games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">게임을 불러오는 중이거나 사용 가능한 게임이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <Suspense key={game.gameId} fallback={<GameCardSkeleton />}>
              <GameCard game={game} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  )
}

// 로딩 중 표시할 스켈레톤 UI
function GameCardSkeleton() {
  return (
    <div className="overflow-hidden flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow animate-pulse">
      <div className="relative aspect-[1/1.414] w-full bg-muted"></div>
      <div className="p-4 flex-1">
        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="h-10 bg-muted rounded w-full"></div>
      </div>
    </div>
  )
}
