interface stringLocalized {
  en: string;
  ko: string;
}

interface Game {
  gameId: number;
  isApproved: boolean;
  uid: string;
  gameTitle: string;
  gameLatestRevision: number;
  gamePlatformWindows: boolean;
  gamePlatformMac: boolean;
  gameEngine: string;
  gameGenre: stringLocalized;
  gameDeveloper: string;
  gamePublisher: string;
  isEarlyAccess: boolean;
  isReleased: boolean;
  gameReleasedDate: string;
  gameWebsite: string;
  gameVideoURL: string;
  gameDownloadMacURL: string | null;
  requirementsMac: string | null;
  gameDownloadWinURL: string | null;
  requirementsWindows: string | null;
  gameImageURL: string[];
  gameBinaryName: string;
  gameHeadline: stringLocalized;
  gameDescription: stringLocalized;
}

interface AuthorInfo {
  username: string;
  email: string;
}

interface Metadata {
  title?: string;
  description?: string;
}

/**
 * 게임 평점 및 리뷰 데이터의 기본 구조
 */
interface GameRating {
  id: number;
  gameId: number;
  uid: string; // DB의 uid (UUID)
  rating: number; // 1~5 또는 1~10 (tinyint 대응)
  title: string;
  content: string; // DB의 body/text 대응
  createdAt: string; // ISO 8601 날짜 문자열
  updatedAt: string;
}

interface GameRatingRequest extends Omit<
  GameRating,
  "id" | "createdAt" | "updatedAt"
> {
  // 클라이언트에서 보낼 때는 이 데이터들만 포함됩니다.
}

/**
 * 로그인 성공 시 서버로부터 받는 응답 데이터 타입
 */
interface AuthResponse {
  token: string;
}

interface AuthResponseInternal {
  success: boolean;
  token: string;
}

interface SignupResponse {
  uid: string;
  username: string;
}

/**
 * API 요청 실패 시 서버로부터 받는 에러 응답 타입
 * (서버 구현에 따라 달라질 수 있습니다)
 */
interface ErrorResponse {
  message: string;
}

interface YouTubeQuery {
  success: boolean;
  totalCount: number;
  videoIds: string[];
}

interface Carousel {
  id: number;
  image: string;
  title: stringLocalized;
  description: stringLocalized;
  href: string | null;
  button: stringLocalized;
}

interface searchParamsPropsSSR {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface BitmapMemberInfo {
  id: number;
  name: string;
  channelId: string;
  avatarUrl: string;
  position: string;
}

export type {
  stringLocalized,
  BitmapMemberInfo,
  Game,
  AuthorInfo,
  Metadata,
  GameRating,
  GameRatingRequest,
  AuthResponse,
  AuthResponseInternal,
  SignupResponse,
  ErrorResponse,
  YouTubeQuery,
  Carousel,
  searchParamsPropsSSR,
};
