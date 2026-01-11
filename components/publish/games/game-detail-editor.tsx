"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Game, stringLocalized } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import {
  getGames,
  getPendingGames,
  submitGame,
  uploadGameImage,
} from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import { Flex } from "@radix-ui/themes";
import GameDetail from "@/components/game-details-pending";

export default function GameDetailEditor() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("GameSubmit");

  const { bIsLoggedIn, bIsDeveloper } = useAuth();

  // 게임 정보 상태
  const [gameId, setGameId] = useState(0);
  const [uid, setUid] = useState("");
  const [gameLatestRevision, setGameLatestRevision] = useState(1);
  const [gamePlatformWindows, setGamePlatformWindows] = useState(false);
  const [gamePlatformMac, setGamePlatformMac] = useState(false);
  const [gamePlatformMobile, setGamePlatformMobile] = useState(false);
  const [gameEngine, setGameEngine] = useState("");
  const [isEarlyAccess, setIsEarlyAccess] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [gameWebsite, setGameWebsite] = useState("");
  const [gameVideoURL, setGameVideoURL] = useState("");
  const [gameDownloadMacURL, setGameDownloadMacURL] = useState("");
  const [gameDownloadWinURL, setGameDownloadWinURL] = useState("");
  const [gameImageURL, setGameImageURL] = useState<string[]>([]);
  const [gameBinaryName, setGameBinaryName] = useState("");

  // 로딩 상태
  const [isLoadingGameId, setIsLoadingGameId] = useState(true);

  const changeLocale = (nextLocale: string) => {
    startTransition(() => {
      // replace를 사용하면 히스토리에 남지 않고 현재 위치에서 언어만 교체됩니다.
      // 페이지 전체 새로고침이 아니라 '소프트 네비게이션'이 일어납니다.
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!file) return;

    await uploadGameImage(file);
  }

  // 게임 ID 자동 생성 - API에서 기존 게임 수를 가져와서 계산
  useEffect(() => {
    async function fetchGames() {
      try {
        setIsLoadingGameId(true);

        const fetchedGames: Game[] = await getGames();
        const fetchedGamesPending: Game[] = await getPendingGames();

        // 기존 게임 수 + 대기 중인 게임 수 + 1 (새로운 게임)
        const newGameId = fetchedGames.length + fetchedGamesPending.length;
        setGameId(newGameId);

        console.log(
          `게임 ID 생성: 기존 게임 ${fetchedGames.length}개 + 대기 중인 게임 ${fetchedGamesPending.length}개 = ${newGameId}`
        );
      } catch (error) {
        console.error("게임 데이터를 가져오는 중 오류가 발생했습니다:", error);

        // API 오류 시 현재 시간을 기반으로 임시 ID 생성
        const fallbackId = Date.now();
        setGameId(fallbackId);

        toast({
          title: "경고",
          description:
            "게임 ID 생성 중 오류가 발생했습니다. 임시 ID가 할당되었습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingGameId(false);
      }
    }

    if (!bIsLoggedIn || !bIsDeveloper) {
      router.push("/account");
    } else {
      fetchGames();
    }
  }, [bIsLoggedIn, bIsDeveloper]);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{t("game-submit")}</h1>

      <div className="space-y-6">
        {/* 게임 ID */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameId")}</CardTitle>
            <CardDescription>{t("gameIdDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingGameId ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-muted-foreground">
                  {t("gameIdAutoGen")}
                </span>
              </div>
            ) : (
              <Input value={gameId} disabled />
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* 최신 리비전 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameLatestRevision")}</CardTitle>
            <CardDescription>{t("gameLatestRevisionDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              value={gameLatestRevision}
              onChange={(e) => setGameLatestRevision(Number(e.target.value))}
              placeholder="1"
              min="1"
            />
          </CardContent>
        </Card>

        <Separator />

        {/* 플랫폼 지원 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gamePlatform")}</CardTitle>
            <CardDescription>{t("gamePlatformDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="windows"
                checked={gamePlatformWindows}
                onCheckedChange={(checked) =>
                  setGamePlatformWindows(checked as boolean)
                }
              />
              <Label htmlFor="windows">{t("gamePlatformWindows")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mac"
                checked={gamePlatformMac}
                onCheckedChange={(checked) =>
                  setGamePlatformMac(checked as boolean)
                }
              />
              <Label htmlFor="mac">{t("gamePlatformMac")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mobile"
                checked={gamePlatformMobile}
                onCheckedChange={(checked) =>
                  setGamePlatformMobile(checked as boolean)
                }
              />
              <Label htmlFor="mobile">{t("gamePlatformMobile")}</Label>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* 게임 엔진 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameEngine")}</CardTitle>
            <CardDescription>{t("gameEngineDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={gameEngine}
              onChange={(e) => setGameEngine(e.target.value)}
              placeholder="Unity, Unreal Engine 등"
            />
          </CardContent>
        </Card>

        <Separator />

        {/* 얼리 액세스 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("isEarlyAccess")}</CardTitle>
            <CardDescription>{t("isEarlyAccessDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="earlyAccess"
                checked={isEarlyAccess}
                onCheckedChange={(checked) =>
                  setIsEarlyAccess(checked as boolean)
                }
              />
              <Label htmlFor="earlyAccess">{t("isEarlyAccess")}</Label>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* 출시 여부 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("isReleased")}</CardTitle>
            <CardDescription>{t("isReleasedDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="released"
                checked={isReleased}
                onCheckedChange={(checked) => setIsReleased(checked as boolean)}
              />
              <Label htmlFor="released">정식 출시됨</Label>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* 웹사이트 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameWebsite")}</CardTitle>
            <CardDescription>{t("gameWebsiteDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={gameWebsite}
              onChange={(e) => setGameWebsite(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </CardContent>
        </Card>

        <Separator />

        {/* 비디오 URL */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameVideoURL")}</CardTitle>
            <CardDescription>{t("gameVideoURLDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={gameVideoURL}
              onChange={(e) => setGameVideoURL(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              type="url"
            />
          </CardContent>
        </Card>

        <Separator />

        {/* 다운로드 URL */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameDownloadURL")}</CardTitle>
            <CardDescription>{t("gameDownloadURLDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gamePlatformMac && (
              <div>
                <Label htmlFor="macDownload">{t("gameDownloadMacURL")}</Label>
                <Input
                  id="macDownload"
                  value={gameDownloadMacURL}
                  onChange={(e) => setGameDownloadMacURL(e.target.value)}
                  placeholder="https://example.com/download/mac"
                  type="url"
                />
              </div>
            )}
            {gamePlatformWindows && (
              <div>
                <Label htmlFor="winDownload">{t("gameDownloadWinURL")}</Label>
                <Input
                  id="winDownload"
                  value={gameDownloadWinURL}
                  onChange={(e) => setGameDownloadWinURL(e.target.value)}
                  placeholder="https://example.com/download/windows"
                  type="url"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* 이미지 URL */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameImageURL")}</CardTitle>
            <CardDescription>
              {t("gameImageURLDesc")}
              <br />
              (1:1.414 비율 권장, 최대 10MiB 업로드 가능)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <Input
              value={gameImageURL}
              onChange={(e) => setGameImageURL(e.target.value)}
              placeholder="https://example.com/image.jpg"
              type="url"
            /> */}
            <div>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <button onClick={handleUpload}>업로드 하기</button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* 바이너리 이름 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameBinaryName")}</CardTitle>
            <CardDescription>{t("gameBinaryNameDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={gameBinaryName}
              onChange={(e) => setGameBinaryName(e.target.value)}
              placeholder="Game.exe, Game.app, Game"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
