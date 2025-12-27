"use client";

import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../lib/AuthContext";
import { getApiLinkByPurpose } from "../lib/utils";
import type { YouTubeQuery } from "../lib/types";
import axios from "axios";

// 1. 토큰 처리를 담당하는 별도의 컴포넌트 분리
function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    // URL에서 ?token=... 값 가져오기
    const token = searchParams.get("token");

    if (token) {
      // A. 로컬 스토리지에 저장
      // localStorage.setItem("accessToken", token);
      login(token);

      // B. URL에서 토큰 제거 (깔끔하게 만들기)
      // replace를 쓰면 뒤로가기 눌렀을 때 로그인 토큰이 있는 URL로 안 돌아감
      router.replace("/");

      // (선택) 로그인 성공 후 대시보드 등으로 이동하려면:
      router.push("/games");
    }
  }, [searchParams, router]);

  return null; // 화면에 아무것도 렌더링하지 않음 (기능만 수행)
}

// 예시 유튜브 데이터
const YOUTUBE_VIDEOS = [
  { id: "1", title: "Game Trailer 1", videoId: "dQw4w9WgXcQ" },
  { id: "2", title: "Game Trailer 2", videoId: "jNQXAC9IVRw" },
  { id: "3", title: "Game Trailer 3", videoId: "9bZkp7q19f0" },
  { id: "4", title: "Game Trailer 4", videoId: "L_jWHffIx5E" },
];

export default function Home() {
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([]);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 유튜브 비디오 데이터를 가져옴
    async function getYouTubeVideos(
      channelId: string
    ): Promise<YouTubeQuery | null> {
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

        return response.data;
      } catch (error) {
        console.error("비디오 ID 가져오는 중 오류 발생:", error);
        return null;
      }
    }
    getYouTubeVideos("UCL137ZWChauNFsma6ifhNdA").then((data) => {
      if (data?.success) {
        console.log(data.videoIds.length)
        setYoutubeVideos(data.videoIds);
      } else console.log(data?.totalCount === data?.videoIds.length);
      console.log(youtubeVideos);
    });
  }, []);

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
          {youtubeVideos.map((video) => (
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
          ))}
        </div>
      </div>

      {/* Suspense로 감싸지 않으면 빌드 시 
        "useSearchParams() causes client-side rendering..." 에러가 날 수 있음 
      */}
      <Suspense fallback={<div>로그인 처리 중...</div>}>
        <TokenHandler />
      </Suspense>
    </div>
  );
}
