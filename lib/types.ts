export interface Game {
  gameId: number;
  gameTitle: string;
  gameLatestRevision: number;
  gamePlatformWindows: number;
  gamePlatformMac: number;
  gamePlatformMobile: number;
  gameEngine: string;
  gameGenre: string;
  gameDeveloper: string;
  gamePublisher: string;
  isEarlyAccess: number;
  isReleased: number;
  gameReleasedDate: string;
  gameWebsite: string;
  gameVideoURL: string;
  gameDownloadMacURL: string | null;
  gameDownloadWinURL: string | null;
  gameImageURL: string;
  gameBinaryName: string;
  gameHeadline: string;
  gameDescription: string;
}

export interface Metadata {
  title?: string;
  description?: string;
}

/**
 * 로그인 성공 시 서버로부터 받는 응답 데이터 타입
 */
export interface AuthResponse {
  token: string;
}

/**
 * API 요청 실패 시 서버로부터 받는 에러 응답 타입
 * (서버 구현에 따라 달라질 수 있습니다)
 */
export interface ErrorResponse {
  message: string;
}
