import axios from "axios";
import { Game } from "@/lib/types";
import { getApiLinkByPurpose } from "@/lib/utils";

// API에서 게임 데이터를 가져오는 함수 - 서버 컴포넌트에서만 호출
async function getGames(
  getPendingOnly: "released" | "pending" | "all"
): Promise<Game[]> {
  try {
    const response = await axios.get<Game[]>(
      getApiLinkByPurpose("games/list"),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (getPendingOnly === "all") {
      return response.data;
    }

    let games: Game[] = [];
    for (const game of response.data) {
      if (game.isApproved && !(getPendingOnly === "pending")) {
        games.push(game);
      }
    }

    return games;
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
      getApiLinkByPurpose("games/list"),
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

async function getGamesByUid(token: string): Promise<Game[]> {
  try {
    const response = await axios.get<Game[]>(
      getApiLinkByPurpose("games/list/uid"),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

// API에서 특정 대기 중인 게임 데이터를 가져오는 함수
async function submitGame(token: string, newGame: Game): Promise<boolean> {
  try {
    // API 호출
    const response = await axios.post<Game>(
      getApiLinkByPurpose("games/submit"),
      newGame,
      {
        timeout: 30000, // 30초 타임아웃
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

async function uploadGameImage(
  file: File | null,
  token: string,
  gameBinaryName: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!file) return "file-not-found";
  if (gameBinaryName === "") return "name-not-specified";

  const formData = new FormData();
  // Multer에서 req.body를 파일 처리 시점에 읽으려면 텍스트 필드를 파일보다 먼저 append 해야 합니다.
  formData.append("gameBinaryName", gameBinaryName);
  formData.append("image", file); // Express의 upload.single('image')와 일치해야 함

  try {
    const response = await axios.post(
      getApiLinkByPurpose("upload/game/image"),
      formData, // 별도의 Header 설정 없이 body에 바로 전달
      {
        timeout: 30000, // 30초 타임아웃
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );

    const data = response.data;
    alert("업로드 성공: " + data.uri);
    return data.uri as string;
  } catch (error: any) {
    console.error("업로드 실패:", error);
    return error.message;
  }
}

export { getGames, getGameById, getGamesByUid, submitGame, uploadGameImage };
