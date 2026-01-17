import { Box, Button, ScrollArea } from "@radix-ui/themes";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getYouTubeVideos } from "@/lib/utils";
import { getGames } from "@/lib/games";
import type { Game } from "@/lib/types";
import { getTranslations } from "next-intl/server";
import GameRedirectButton from "@/components/games/game-redirect-button";

export default async function Home() {
  // 서버에서 직접 데이터 페칭
  const youtubeVideos = await getYouTubeVideos("UCL137ZWChauNFsma6ifhNdA");
  const games: Game[] = await getGames("released");
  const t = await getTranslations("MainPage");

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 text-center space-y-12">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6">{t("welcome-bitmap")}</h1>
        <p className="text-xl mb-8 max-w-2xl">{t("welcome-bitmap-desc")}</p>
      </div>

      {/* 유튜브 영상 가로 스크롤 섹션 */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-left">{t("works")}</h2>
        <ScrollArea type="always" scrollbars="horizontal">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {youtubeVideos.length > 0 ? (
              youtubeVideos.slice(0, 10).map((video) => (
                <div
                  key={video}
                  className="flex-none w-[85vw] md:w-[300px] aspect-video bg-black rounded-lg overflow-hidden snap-center shadow-md"
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
                {t("api-error")}
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-left">{t("games")}</h2>
        <ScrollArea type="always" scrollbars="horizontal">
          <div className="flex gap-4 pb-4">
            {games.length > 0 ? (
              games.map((game) => (
                <GameRedirectButton
                  key={game.gameId}
                  disabled={false}
                  gameId={game.gameId}
                  gameImageURL={game.gameImageURL[1] || game.gameImageURL[0]}
                  gameTitle={game.gameTitle}
                  gameDeveloper={game.gameDeveloper}
                />
              ))
            ) : (
              <p className="text-gray-500 w-full text-center py-10">
                {t("api-error")}
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
