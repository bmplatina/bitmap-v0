import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  AuthResponse,
  AuthResponseInternal,
  AuthorInfo,
  ErrorResponse,
  Game,
  SignupResponse,
  YouTubeQuery,
  stringLocalized,
} from "@/lib/types";
import axios from "axios";
import dayjs from "dayjs";
import sanitizeHtml from "sanitize-html"; // (선택사항) 보안을 위해 추천

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getLocalizedString(locale: string, t: stringLocalized): string {
  return locale === "ko" ? t.ko : t.en;
}

async function getEula(eula: string): Promise<stringLocalized> {
  try {
    const response = await axios.get<stringLocalized>(
      getApiLinkByPurpose(`eula/${eula}`),
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.ko) {
      return response.data;
    }
    return { ko: "", en: "" };
  } catch (error) {
    console.error("EULA 가져오는 중 오류 발생:", error);
    return { ko: "", en: "" };
  }
}

const formatDate = (locale: string, dateString: string) => {
  if (!dateString) return "미정";
  const format: string = locale === "ko" ? "YYYY/MM/DD" : "MM/DD/YYYY";
  return dayjs(dateString).format(format);
};

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
    const basePath = "/absproxy/3000";
    if (window.location.pathname.startsWith(basePath)) {
      return `${basePath}/api-proxy/${substring}`;
    }
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

const checkAuthor = async (uid: string): Promise<AuthorInfo | null> => {
  // 1. 초기값을 null로 설정하여 에러 발생 시에도 안전하게 리턴
  let author: AuthorInfo | null = null;

  try {
    const response = await axios.post(
      getApiLinkByPurpose("auth/profile/query/uid"), // 백엔드 라우트 주소와 일치 확인
      {
        uid: uid,
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 2. 백엔드에서 보낸 JSON 구조에 맞춰 할당
    // 백엔드 응답: { username: "...", email: "..." }
    if (response.data && response.data.username) {
      author = {
        username: response.data.username,
        email: response.data.email,
      };
    }
  } catch (error: any) {
    // 3. 에러 핸들링 구체화
    if (error.code === "ECONNABORTED") {
      console.error("요청 시간이 초과되었습니다.");
    } else {
      console.error(
        "데이터를 불러오는 중 에러 발생:",
        error.response?.data || error.message
      );
    }
  }

  return author; // 실패 시 null, 성공 시 객체 리턴
};

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

/**
 * 로그인 핸들링 함수
 * @param email
 * @param password
 * @returns 유효한 로그인이면 토큰을, 유효하지 않으면 로그인 실패 이유를 반환
 */
const login = async (
  email: string,
  password: string
): Promise<AuthResponseInternal> => {
  try {
    const response = await axios.post<AuthResponse>(
      getApiLinkByPurpose("auth/login"),
      {
        email: email,
        password: password,
      },
      {
        timeout: 30000, // 30초 타임아웃
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.token) {
      // login(response.data.token);
      console.log(response.data.token);
      return { success: true, token: response.data.token };
    }
    // bSetLoggedInState(true);
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      // error가 AxiosError<ErrorResponse> 타입임이 확인됨
      // 이제 error.response?.data?.message 와 같이 안전하게 접근 가능

      const payload = error.response?.data;
      const errorMessage: string =
        typeof payload === "string"
          ? payload
          : payload?.message ?? "알 수 없는 에러가 발생했습니다.";
      console.error("로그인 실패:", errorMessage);
      return { success: false, token: errorMessage };

      // 서버에서 보낸 구체적인 에러 메시지를 alert 등으로 사용자에게 보여줄 수 있습니다.
      // alert(errorMessage);
    } else {
      // Axios 에러가 아닌 다른 종류의 에러 처리 (예: 네트워크 연결 실패 전 요청 설정 오류)
      console.error("예상치 못한 에러가 발생했습니다:", error);
    }
    // bSetLoggedInState(false);
  }
  return { success: false, token: "" };
};

const signup = async (
  username: string,
  email: string,
  password: string,
  bIsDeveloper: boolean,
  bIsTeammate: boolean
): Promise<SignupResponse> => {
  try {
    const response = await axios.post<SignupResponse>(
      getApiLinkByPurpose("auth/signup"),
      { username, email, password, bIsDeveloper, bIsTeammate }
    );
    return response.data;
  } catch (error: any) {
    // 백엔드에서 보낸 에러 메시지 처리 (예: "username-exists", "require-id-pw")
    const message = error.response?.data || "server-error";
    throw new Error(message);
  }
};

const verifySignup = async (email: string, code: string): Promise<string> => {
  try {
    const response = await axios.post<string>(
      getApiLinkByPurpose("auth/verify-code"),
      { email, code }
    );

    return response.data;
  } catch (error: any) {
    // [수정됨] 네트워크 에러 등 response가 없는 경우에 대한 방어 코드 추가
    if (error.response && error.response.data) {
      return error.response.data;
    }
    // 서버 응답이 없거나 다른 에러인 경우
    return "server-error";
  }
};

export {
  cn,
  checkAuthor,
  formatDate,
  getApiLinkByPurpose,
  getEula,
  getLocalizedString,
  getYouTubeVideos,
  getGames,
  getGameById,
  getPendingGames,
  getPendingGameById,
  login,
  signup,
  renderMarkdown,
  submitGame,
  uploadGameImage,
  verifySignup,
};
