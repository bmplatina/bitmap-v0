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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Edit, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn, getLocalizedString } from "@/lib/utils";
import type { Game, stringLocalized } from "@/lib/types";
import MarkdownEditor from "@/components/common/markdown/markdown-editor";
import { toast } from "@/hooks/use-toast";
import { renderMarkdown } from "@/lib/utils";
import { getGames, submitGame, uploadGameImage } from "@/lib/games";
import { useAuth } from "@/lib/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import { Flex, Quote } from "@radix-ui/themes";
import GameDetail from "@/components/games/game-details-pending";
import ClientMarkdown from "@/components/common/markdown/client-markdown";

export default function RegisterGamePage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("GameSubmit");

  const { bIsLoggedIn, bIsDeveloper } = useAuth();

  // 게임 정보 상태
  const [gameId, setGameId] = useState(0);
  const [uid, setUid] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [gameLatestRevision, setGameLatestRevision] = useState(1);
  const [gamePlatformWindows, setGamePlatformWindows] = useState(false);
  const [gamePlatformMac, setGamePlatformMac] = useState(false);
  const [gamePlatformMobile, setGamePlatformMobile] = useState(false);
  const [gameEngine, setGameEngine] = useState("");
  const [gameGenre, setGameGenre] = useState<stringLocalized>({
    ko: "",
    en: "",
  });
  const [gameDeveloper, setGameDeveloper] = useState("");
  const [gamePublisher, setGamePublisher] = useState("");
  const [isEarlyAccess, setIsEarlyAccess] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [gameReleasedDate, setGameReleasedDate] = useState<Date>();
  const [gameWebsite, setGameWebsite] = useState("");
  const [gameVideoURL, setGameVideoURL] = useState("");
  const [gameDownloadMacURL, setGameDownloadMacURL] = useState("");
  const [gameDownloadWinURL, setGameDownloadWinURL] = useState("");
  const [gameImageURL, setGameImageURL] = useState<string[]>([]);
  const [gameBinaryName, setGameBinaryName] = useState("");
  const [gameHeadline, setGameHeadline] = useState<stringLocalized>({
    ko: "",
    en: "",
  });
  const [gameDescription, setGameDescription] = useState<stringLocalized>({
    ko: "",
    en: "",
  });

  // 로딩 상태
  const [isLoadingGameId, setIsLoadingGameId] = useState(true);

  // 모달 상태
  const [isDescriptionKoModalOpen, setIsDescriptionKoModalOpen] =
    useState(false);
  const [isDescriptionEnModalOpen, setIsDescriptionEnModalOpen] =
    useState(false);
  const [isPreviewModalOpenKo, setIsPreviewModalOpenKo] = useState(false);
  const [isPreviewModalOpenEn, setIsPreviewModalOpenEn] = useState(false);
  const [tempDescriptionKo, setTempDescriptionKo] = useState<string>("");
  const [tempDescriptionEn, setTempDescriptionEn] = useState<string>("");

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeLocale = (nextLocale: string) => {
    startTransition(() => {
      // replace를 사용하면 히스토리에 남지 않고 현재 위치에서 언어만 교체됩니다.
      // 페이지 전체 새로고침이 아니라 '소프트 네비게이션'이 일어납니다.
      router.replace(pathname, { locale: nextLocale });
    });
  };

  // 날짜 포맷팅 함수 (MySQL 형식)
  const formatDateToMySQL = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 미리보기용 게임 객체 생성
  const createPreviewGame = (): Game => {
    return {
      gameId,
      uid,
      isApproved: false,
      gameTitle,
      gameLatestRevision,
      gamePlatformWindows: gamePlatformWindows,
      gamePlatformMac: gamePlatformMac,
      gamePlatformMobile: gamePlatformMobile,
      gameEngine,
      gameGenre,
      gameDeveloper,
      gamePublisher,
      isEarlyAccess: isEarlyAccess,
      isReleased: isReleased,
      gameReleasedDate: gameReleasedDate
        ? formatDateToMySQL(gameReleasedDate)
        : "",
      gameWebsite,
      gameVideoURL,
      gameDownloadMacURL: gameDownloadMacURL || null,
      gameDownloadWinURL: gameDownloadWinURL || null,
      gameImageURL,
      gameBinaryName,
      gameHeadline,
      gameDescription,
    };
  };

  // 게임 제출 함수
  const handleSubmit = async (): Promise<void> => {
    try {
      setIsSubmitting(true);

      // 필수 필드 검증
      if (!gameTitle.trim()) {
        toast({
          title: "오류",
          description: "게임 제목을 입력해주세요.",
          variant: "destructive",
        });
        return;
      }

      if (!gameDeveloper.trim()) {
        toast({
          title: "오류",
          description: "개발자 이름을 입력해주세요.",
          variant: "destructive",
        });
        return;
      }

      if (!gameGenre.ko.trim() && !gameGenre.en.trim()) {
        toast({
          title: "오류",
          description: "게임 장르를 입력해주세요.",
          variant: "destructive",
        });
        return;
      }

      // API 전송용 게임 데이터 생성
      const postGame: Game = {
        gameId,
        uid,
        isApproved: false,
        gameTitle,
        gameLatestRevision,
        gamePlatformWindows: gamePlatformWindows,
        gamePlatformMac: gamePlatformMac,
        gamePlatformMobile: gamePlatformMobile,
        gameEngine,
        gameGenre,
        gameDeveloper,
        gamePublisher,
        isEarlyAccess: isEarlyAccess,
        isReleased: isReleased,
        gameReleasedDate: gameReleasedDate
          ? formatDateToMySQL(gameReleasedDate)
          : "",
        gameWebsite,
        gameVideoURL,
        gameDownloadMacURL: gameDownloadMacURL || null,
        gameDownloadWinURL: gameDownloadWinURL || null,
        gameImageURL,
        gameBinaryName,
        gameHeadline,
        gameDescription,
      };

      console.log("Submitting game data:", postGame);

      const token = localStorage.getItem("accessToken");

      if (!token) throw new Error("token-required");
      if (await submitGame(token, postGame)) {
        // 성공 알림
        toast({
          title: "성공",
          description:
            "게임이 성공적으로 등록되었습니다! 승인 대기 상태로 전환됩니다.",
        });

        // 미리보기 모달 닫기
        setIsPreviewModalOpenKo(false);
        /** @todo English*/

        // 대기 중인 게임 페이지로 이동
        router.push("/games/pending");
      }
    } catch (error) {
      console.error("Error submitting:", error);

      // 에러 알림
      toast({
        title: "오류",
        description: "게임 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!file) return;

    await uploadGameImage(file, "", "");
  }

  // 마크다운 편집 모달 열기
  const openDescriptionModalKo = () => {
    setTempDescriptionKo(gameDescription.ko);
    setIsDescriptionKoModalOpen(true);
  };

  const openDescriptionModalEn = () => {
    setTempDescriptionEn(gameDescription.en);
    setIsDescriptionEnModalOpen(true);
  };

  // 마크다운 편집 저장
  const saveDescriptionKo = () => {
    setGameDescription({ ...gameDescription, ko: tempDescriptionKo });
    setIsDescriptionKoModalOpen(false);
  };

  const saveDescriptionEn = () => {
    setGameDescription({ ...gameDescription, en: tempDescriptionEn });
    setIsDescriptionEnModalOpen(false);
  };

  // 마크다운 편집 취소
  const cancelDescriptionKo = () => {
    setTempDescriptionKo(gameDescription.ko);
    setIsDescriptionKoModalOpen(false);
  };

  const cancelDescriptionEn = () => {
    setTempDescriptionEn(gameDescription.en);
    setIsDescriptionEnModalOpen(false);
  };

  // 게임 ID 자동 생성 - API에서 기존 게임 수를 가져와서 계산
  useEffect(() => {
    async function fetchGames() {
      try {
        setIsLoadingGameId(true);

        const fetchedGames: Game[] = await getGames("all");

        setGameId(fetchedGames.length);
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

        {/* 게임 제목 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameTitle")} *</CardTitle>
            <CardDescription>{t("gameTitleDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              placeholder={t("gameTitle")}
              required
            />
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

        {/* 장르 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameGenre")} *</CardTitle>
            <CardDescription>{t("gameGenreDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Flex>
              <Input
                className="mr-2"
                value={gameGenre.ko}
                onChange={(e) =>
                  setGameGenre({ ...gameGenre, ko: e.target.value })
                }
                placeholder="KO: 액션, RPG, 퍼즐 등"
                required
              />
              <Input
                value={gameGenre.en}
                onChange={(e) =>
                  setGameGenre({ ...gameGenre, en: e.target.value })
                }
                placeholder="EN: Action, RPG, Puzzle, etc."
                required
              />
            </Flex>
          </CardContent>
        </Card>

        <Separator />

        {/* 개발자 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameDeveloper")} *</CardTitle>
            <CardDescription>{t("gameDeveloperDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={gameDeveloper}
              onChange={(e) => setGameDeveloper(e.target.value)}
              placeholder={t("gameDeveloper")}
              required
            />
          </CardContent>
        </Card>

        <Separator />

        {/* 퍼블리셔 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gamePublisher")}</CardTitle>
            <CardDescription>{t("gamePublisherDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={gamePublisher}
              onChange={(e) => setGamePublisher(e.target.value)}
              placeholder={t("gamePublisher")}
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

        {/* 출시일 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameReleasedDate")}</CardTitle>
            <CardDescription>{t("gameReleasedDateDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !gameReleasedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {gameReleasedDate
                    ? format(gameReleasedDate, "PPP", { locale: ko })
                    : "날짜를 선택하세요"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={gameReleasedDate}
                  onSelect={setGameReleasedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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

        <Separator />

        {/* 게임 헤드라인 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameHeadline")}</CardTitle>
            <CardDescription>{t("gameHeadlineDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Flex>
              <Input
                className="mr-2"
                value={gameHeadline.ko}
                onChange={(e) =>
                  setGameHeadline({ ...gameHeadline, ko: e.target.value })
                }
                placeholder="KO: 게임을 나타내는 한 문장을 입력하십시오."
              />
              <Input
                value={gameHeadline.en}
                onChange={(e) =>
                  setGameHeadline({ ...gameHeadline, en: e.target.value })
                }
                placeholder="EN: Please enter a one-liner that represents the game."
              />
            </Flex>
          </CardContent>
        </Card>

        <Separator />

        {/* 게임 설명 한글 */}
        <Card>
          <CardHeader>
            <CardTitle>{`KO: ${t("gameDescription")}`}</CardTitle>
            <CardDescription>{t("gameDescriptionDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[100px] p-3 border rounded-md bg-muted">
              {/* <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(gameDescription.ko),
                }}
              /> */}
              <ClientMarkdown content={gameDescription.ko} />
            </div>
            <Dialog
              open={isDescriptionKoModalOpen}
              onOpenChange={setIsDescriptionKoModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" onClick={openDescriptionModalKo}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("edit-md")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>{t("edit-md")}</DialogTitle>
                  <DialogDescription>{t("edit-md-desc")}</DialogDescription>
                </DialogHeader>
                <MarkdownEditor
                  value={tempDescriptionKo}
                  onChange={setTempDescriptionKo}
                  onSave={saveDescriptionKo}
                  onCancel={cancelDescriptionKo}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* 게임 설명 영어 */}
        <Card>
          <CardHeader>
            <CardTitle>{`EN: ${t("gameDescription")}`}</CardTitle>
            <CardDescription>{t("gameDescriptionDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[100px] p-3 border rounded-md bg-muted">
              {/* <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(gameDescription.en),
                }}
              /> */}
              <ClientMarkdown content={gameDescription.en} />
            </div>
            <Dialog
              open={isDescriptionEnModalOpen}
              onOpenChange={setIsDescriptionEnModalOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" onClick={openDescriptionModalEn}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("edit-md")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>{t("edit-md")}</DialogTitle>
                  <DialogDescription>{t("edit-md-desc")}</DialogDescription>
                </DialogHeader>
                <MarkdownEditor
                  value={tempDescriptionEn}
                  onChange={setTempDescriptionEn}
                  onSave={saveDescriptionEn}
                  onCancel={cancelDescriptionEn}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Separator />

        {/* 제출 버튼 */}
        <div className="flex justify-center pt-6">
          <Dialog
            open={isPreviewModalOpenKo}
            onOpenChange={setIsPreviewModalOpenKo}
          >
            <DialogTrigger asChild>
              <Button size="lg" className="px-8">
                {t("submit")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("submitting")}</DialogTitle>
                <DialogDescription>{t("submit-warning")}</DialogDescription>
              </DialogHeader>
              <GameDetail game={createPreviewGame()} uid={uid} />
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewModalOpenKo(false)}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  variant="outline"
                  onClick={() => changeLocale(locale === "ko" ? "en" : "ko")}
                >
                  언어 변경
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      등록 중...
                    </>
                  ) : (
                    "등록 신청"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
