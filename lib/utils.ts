import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Game, YouTubeQuery } from "./types";
import axios from "axios";
import sanitizeHtml from "sanitize-html"; // (선택사항) 보안을 위해 추천

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 간단한 마크다운 렌더링 함수
const renderMarkdown = (text: string) => {
  if (!text) return "";

  let html = text.replace(/\\n/g, "\n");

  // --- 인용문 처리 ---
  html = html.replace(
    /^> (.*$)/gim,
    '<Quote class="mt-4 mb-2 pl-4 border-l-4 border-muted-foreground italic text-muted-foreground">$1</Quote>'
  );

  // --- 헤더 처리 (크기 Up!) ---
  html = html
    // H3: text-lg -> text-xl (조금 더 크게)
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-bold mt-6 mb-2 text-foreground">$1</h3>'
    )
    // H2: text-xl -> text-3xl (확실히 크게)
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-3xl font-extrabold mt-10 mb-3 tracking-tight text-foreground">$1</h2>'
    )
    // H1: text-2xl -> text-4xl (가장 크게)
    .replace(
      /^# (.*$)/gim,
      '<h1 class="text-4xl font-black mt-12 mb-4 tracking-tight text-foreground">$1</h1>'
    );

  // --- 인라인 스타일 ---
  html = html
    .replace(
      /\*\*(.*?)\*\*/gim,
      '<strong class="font-bold text-foreground">$1</strong>'
    )
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    .replace(
      /`([^`]+)`/gim,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">$1</code>'
    );

  // --- 줄바꿈 정리 ---
  html = html.replace(/(<\/h[1-3]>|<\/Quote>)\n/g, "$1");
  html = html.replace(/\n/g, "<br />");

  return html;
};

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

// API에서 특정 대기 중인 게임 데이터를 가져오는 함수
async function submitGame(gameInfo: Game): Promise<boolean> {
  try {
    // API 호출
    const response = await axios.post<Game>(
      getApiLinkByPurpose("games/submit"),
      gameInfo,
      {
        timeout: 30000, // 30초 타임아웃
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Submit succeed:", response.data);

    // 성공 알림
    return true;
  } catch (error) {
    console.error("대기 중인 게임 데이터를 가져오는 중 오류 발생:", error);
    return false;
  }
}

async function uploadGameImage(file: File | null) {
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file); // Express의 upload.single('image')와 일치해야 함

  try {
    const response = await fetch(getApiLinkByPurpose("game/image"), {
      method: "POST",
      body: formData, // 별도의 Header 설정 없이 body에 바로 전달
    });

    const data = await response.json();
    alert("업로드 성공: " + data.filePath);
  } catch (error) {
    console.error("업로드 실패:", error);
  }
}

export {
  cn,
  renderMarkdown,
  getApiLinkByPurpose,
  getYouTubeVideos,
  getGames,
  getGameById,
  getPendingGames,
  getPendingGameById,
  submitGame,
  uploadGameImage,
};
