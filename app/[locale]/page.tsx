import { Button } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getYouTubeVideos, getGames } from "@/lib/utils";
import type { Game } from "@/lib/types";
import { TokenHandler } from "@/components/token-handler";

export default async function Home() {
  // 서버에서 직접 데이터 페칭
  const youtubeVideos = await getYouTubeVideos("UCL137ZWChauNFsma6ifhNdA");
  const games: Game[] = await getGames();

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center space-y-12">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6">
          Bitmap에 오신 것을 환영합니다
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          인디 개발자부터 대형 퍼블리셔까지, 최신 게임을 발견하고 다운로드하여
          플레이하세요.
        </p>
        <Button asChild size="4">
          <Link href="/games">게임 둘러보기</Link>
        </Button>
      </div>

      {/* 유튜브 영상 가로 스크롤 섹션 */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-left">Our Works</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
          {youtubeVideos.length > 0 ? (
            youtubeVideos.slice(0, 10).map((video) => (
              <div
                key={video}
                className="flex-none w-[300px] aspect-video bg-black rounded-lg overflow-hidden snap-center shadow-md"
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 w-full text-center py-10">
              영상을 불러올 수 없거나 목록이 비어 있습니다.
            </p>
          )}
        </div>
      </div>

      {/* 게임 목록 가로 스크롤 섹션 */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-left">Games</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
          {games.length > 0 ? (
            games.map((game) => (
              <Link
                key={game.gameId}
                href={`/games/${game.gameId}`}
                className="flex-none w-[300px] aspect-video relative rounded-lg overflow-hidden snap-center shadow-md group"
              >
                <Image
                  src={
                    game.gameImageURL || "/placeholder.svg?height=400&width=283"
                  }
                  alt={game.gameTitle}
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                {/* 하단 텍스트 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 text-left">
                  <h3 className="text-white text-2xl font-bold leading-tight">
                    {game.gameTitle}
                  </h3>
                  <p className="text-white/80 text-sm font-medium">
                    {game.gameDeveloper}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 w-full text-center py-10">
              등록된 게임이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 클라이언트 사이드 로직(토큰 처리)은 별도 컴포넌트로 유지 */}
      <Suspense fallback={null}>
        <TokenHandler />
      </Suspense>
    </div>
  );
}
