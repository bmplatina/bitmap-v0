import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { Suspense } from "react";
import { getApiLinkByPurpose } from "../lib/utils";
import type { YouTubeQuery } from "../lib/types";
import axios from "axios";
import { TokenHandler } from "../components/token-handler";

// 서버 사이드에서 데이터를 가져오는 함수
async function getYouTubeVideos(channelId: string): Promise<string[]> {
  try {
    const response = await axios.get<YouTubeQuery>(
      getApiLinkByPurpose(`youtube/get-videos/${channelId}`),
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.success) {
      return response.data.videoIds;
    }
    return [];
  } catch (error) {
    console.error("비디오 ID 가져오는 중 오류 발생:", error);
    return [];
  }
}

export default async function Home() {
  // 서버에서 직접 데이터 페칭
  const youtubeVideos = await getYouTubeVideos("UCL137ZWChauNFsma6ifhNdA");

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

      {/* 클라이언트 사이드 로직(토큰 처리)은 별도 컴포넌트로 유지 */}
      <Suspense fallback={null}>
        <TokenHandler />
      </Suspense>
    </div>
  );
}
