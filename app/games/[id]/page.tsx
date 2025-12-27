import { Suspense } from "react";
import type { Game, Metadata } from "../../../lib/types";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import Image from "next/image";
import { Calendar, User, Tag, Globe, Monitor, Apple } from "lucide-react";
import { getApiLinkByPurpose } from "../../../lib/utils";
import dayjs from "dayjs";
import axios from "axios";
import { getGameById } from "../../../lib/utils";
interface AuthorInfo {
  username: string;
  email: string;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const game = await getGameById(params.id);

  if (!game) {
    return {
      title: "Bitmap Store: 게임을 찾을 수 없습니다",
    };
  }

  return {
    title: `Bitmap Store: ${game.gameTitle}`,
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const game = await getGameById(params.id);

  if (!game) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <p className="text-xl mb-2">게임을 찾을 수 없습니다</p>
          <p className="text-sm text-muted-foreground">
            요청하신 게임이 존재하지 않거나 데이터를 불러오는 중 문제가
            발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  const checkAuthor = async (): Promise<AuthorInfo | null> => {
    // 1. 초기값을 null로 설정하여 에러 발생 시에도 안전하게 리턴
    let author: AuthorInfo | null = null;

    try {
      const response = await axios.post(
        getApiLinkByPurpose("auth/profile/query/uid"), // 백엔드 라우트 주소와 일치 확인
        {
          uid: game.uid,
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

  const author: AuthorInfo | null = await checkAuthor();

  // 출시일 포맷팅 - day.js 사용
  const formatDate = (dateString: string) => {
    if (!dateString) return "미정";
    return dayjs(dateString).format("YYYY/MM/DD");
  };

  return (
    <div className="container mx-auto p-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 컬럼 - 이미지 */}
        <div className="lg:col-span-1">
          <Suspense
            fallback={
              <div className="aspect-[1/1.414] w-full rounded-lg bg-muted"></div>
            }
          >
            <div className="relative aspect-[1/1.414] w-full rounded-lg overflow-hidden">
              <Image
                src={
                  game.gameImageURL || "/placeholder.svg?height=600&width=424"
                }
                alt={game.gameTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Suspense>

          <div className="mt-6 space-y-4">
            {game.gameWebsite && (
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={game.gameWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  웹사이트 방문
                </a>
              </Button>
            )}

            <Button className="w-full" variant="default" asChild>
              <a href={`/about/${game.gameId}`} rel="noopener noreferrer">
                <Monitor className="mr-2 h-4 w-4" />
                Bitmap App에서 보기
              </a>
            </Button>

            {/*game.gameDownloadWinURL && (
                  <Button className="w-full">
                    <Monitor className="mr-2 h-4 w-4" />
                    Windows 다운로드
                  </Button>
              )*/}

            {/*game.gameDownloadMacURL && (
                  <Button className="w-full" variant="secondary">
                    <Apple className="mr-2 h-4 w-4" />
                    Mac 다운로드
                  </Button>
              )*/}
          </div>
        </div>

        {/* 오른쪽 컬럼 - 상세 정보 */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{game.gameTitle}</h1>
            {game.isEarlyAccess === 1 && (
              <Badge className="bg-amber-500">얼리 액세스</Badge>
            )}
          </div>

          <h2 className="text-xl text-muted-foreground mb-6">
            {game.gameHeadline}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>
                개발사: <strong>{game.gameDeveloper}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>
                퍼블리셔: <strong>{game.gamePublisher}</strong>
                <br />
                {author && `게시자: ${author.username}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <span>
                장르: <strong>{game.gameGenre}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                출시일: <strong>{formatDate(game.gameReleasedDate)}</strong>
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">게임 소개</h3>
            <div className="prose prose-invert max-w-none">
              <p>{game.gameDescription}</p>
            </div>
          </div>

          {game.gameVideoURL && (
            <div>
              <h3 className="text-xl font-semibold mb-4">트레일러</h3>
              <Suspense
                fallback={
                  <div className="aspect-video w-full rounded-lg bg-muted"></div>
                }
              >
                <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${game.gameVideoURL}`}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
