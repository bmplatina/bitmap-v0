import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Game, YouTubeQuery } from "./types";
import axios from "axios";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * API 링크 생성
 * @param substring 도메인 뒤 링크
 */
function getApiLinkByPurpose(substring: string): string {
  // 클라이언트 환경(브라우저)에서는 CORS 방지를 위해 Next.js Rewrite 프록시 사용
  if (typeof window !== "undefined") {
    return `/api-proxy/${substring}`;
  }

  const API_DOMAIN: string = "https://api.prodbybitmap.com/";
  return `${API_DOMAIN}${substring}`;
}

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

// API에서 게임 데이터를 가져오는 함수 - 서버 컴포넌트에서만 호출
async function getGames(): Promise<Game[]> {
  try {
    const response = await axios.get<Game[]>(
      getApiLinkByPurpose("games/released"),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("게임 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 빈 배열 반환 (또는 fallback 데이터 사용 가능)
    return [];
  }
}

// API에서 특정 게임 데이터를 가져오는 함수
async function getGameById(id: string): Promise<Game | null> {
  try {
    const response = await axios.get<Game[]>(
      getApiLinkByPurpose("games/released"),
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const game = response.data.find((g) => g.gameId.toString() === id);
    return game || null;
  } catch (error) {
    console.error("게임 데이터를 가져오는 중 오류 발생:", error);
    return null;
  }
}

// API에서 대기 중인 게임 데이터를 가져오는 함수 - 서버 컴포넌트에서만 호출
async function getPendingGames(): Promise<Game[]> {
  try {
    const response = await axios.get<Game[]>(
      getApiLinkByPurpose("games/pending"),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("대기 중인 게임 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 빈 배열 반환
    return [];
  }
}

// API에서 특정 대기 중인 게임 데이터를 가져오는 함수
async function getPendingGameById(id: string): Promise<Game | null> {
  try {
    const response = await axios.get<Game[]>(
      getApiLinkByPurpose("games/pending"),
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const game = response.data.find((g) => g.gameId.toString() === id);
    return game || null;
  } catch (error) {
    console.error("대기 중인 게임 데이터를 가져오는 중 오류 발생:", error);
    return null;
  }
}

export {
  cn,
  getApiLinkByPurpose,
  getYouTubeVideos,
  getGames,
  getGameById,
  getPendingGames,
  getPendingGameById,
};
