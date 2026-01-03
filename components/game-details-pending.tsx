"use client";

import { useState, useEffect, Suspense } from "react";
import type { Game } from "../lib/types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Clock, Calendar, User, Tag, Globe, Monitor, Code } from "lucide-react";
import {
  checkAuthor,
  formatDate,
  renderMarkdown,
  getLocalizedString,
} from "../lib/utils";
import { useTranslations, useLocale } from "next-intl";
import SmartMarkdown from "./markdown-renderer";

interface AuthorInfo {
  username: string;
  email: string;
}

type GameDetailProps = {
  game: Game;
  uid: string;
};

export default function GameDetail({ game, uid }: GameDetailProps) {
  const locale = useLocale();
  const t = useTranslations("GamesView");
  const t_gameSubmit = useTranslations("GameSubmit");
  const [author, setAuthor] = useState<AuthorInfo | null>(null);

  if (!game) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <p className="text-xl mb-2">{t("unknown-game")}</p>
          <p className="text-sm text-muted-foreground">{t("unknown-game")}</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    checkAuthor(uid).then((payload: AuthorInfo | null) => {
      setAuthor(payload);
    });
  }, [author]);

  return (
    <div className="container mx-auto p-6 w-full">
      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Clock className="h-5 w-5" />
          <span className="font-medium">
            이 게임은 현재 승인 대기 중입니다.
          </span>
        </div>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          관리자 검토 후 정식 게임 라이브러리에 추가됩니다.
        </p>
      </div>
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
                  {t("official-website")}
                </a>
              </Button>
            )}

            <Button className="w-full" variant="default" asChild>
              <a href={`/about/${game.gameId}`} rel="noopener noreferrer">
                <Monitor className="mr-2 h-4 w-4" />
                {t("view-in-bitmap-app")}
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
            <Badge className="bg-amber-500">
              {t_gameSubmit("waiting-approval")}
            </Badge>
            {game.isEarlyAccess === 1 && (
              <Badge className="bg-amber-500">{t("early-access")}</Badge>
            )}
          </div>

          <h2 className="text-xl text-muted-foreground mb-6">
            {getLocalizedString(locale, game.gameHeadline)}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-muted-foreground" />
              <span>
                {t("developer")}: <strong>{game.gameDeveloper}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>
                {t("publisher")}: <strong>{game.gamePublisher}</strong>
                <br />
                {author && `${t("author")}: ${author.username}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <span>
                {t("genre")}:{" "}
                <strong>{getLocalizedString(locale, game.gameGenre)}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>
                {t("released-date")}:{" "}
                <strong>{formatDate(locale, game.gameReleasedDate)}</strong>
              </span>
            </div>
          </div>

          {game.gameVideoURL && (
            <div>
              <h3 className="text-xl font-semibold mb-4">{t("preview")}</h3>
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

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{`${t(
              "information-of"
            )} ${game.gameTitle}`}</h3>
            {/* <div className="prose prose-invert max-w-none">
              <p>{game.gameDescription}</p>
            </div> */}
            <SmartMarkdown
              content={getLocalizedString(locale, game.gameDescription)}
            />
            {/*<div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(
                  getLocalizedString(locale, game.gameDescription)
                ),
              }}
            />*/}
          </div>
        </div>
      </div>
    </div>
  );
}
