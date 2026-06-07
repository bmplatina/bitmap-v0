"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  Flex,
  ScrollArea,
  Skeleton,
  Text,
  TextField,
} from "@radix-ui/themes"; // @radix-ui/themes 사용
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useGameForm } from "@/lib/GamePublishContext";
import { Separator } from "@/components/ui/separator";
import { extractYoutubeId, imageUriRegExp, cn } from "@/lib/utils";
import { CaidxLists } from "@/lib/types";
import { uploadGameImage, uploadDesync, getAllCaidxById } from "@/lib/games";
import WindowsLogo from "@/public/platforms/platformWindows10.png";
import MacLogo from "@/public/platforms/platformMac.png";

const GameRedirectButton = dynamic(
  () => import("@/components/games/game-redirect-button"),
  {
    ssr: false,
    loading: () => <Skeleton />,
  },
);

export default function GameAssetsUploader() {
  const t = useTranslations("GameSubmit");
  const t_common = useTranslations("Common");
  const {
    gameData: game,
    updateField,
    setImage,
    updateImages,
    bIsEditingExisting,
  } = useGameForm();

  const [tempYouTubeVideoId, setTempYouTubeVideoId] = useState<string>("");
  const [existingCaidxList, setExistingCaidxList] = useState<CaidxLists>();
  const caidxParse: RegExp = /^([a-zA-Z]+)_(v[\d.]+)\.caidx$/;

  // 통합된 파일 및 미리보기 상태 관리 타입 정의
  type ImageType = "poster" | "gameListBanner" | "gameIcon" | "gameImage";

  const [selectedFiles, setSelectedFiles] = useState<
    Record<ImageType, File | null>
  >({
    poster: null,
    gameListBanner: null,
    gameIcon: null,
    gameImage: null,
  });

  const [previewUrls, setPreviewUrls] = useState<
    Record<ImageType, string | null>
  >({
    poster: null,
    gameListBanner: null,
    gameIcon: null,
    gameImage: null,
  });

  // Desync 파일 상태 관리
  type DesyncFileType = "catar" | "caidx" | "caibx";

  const [desyncFiles, setDesyncFiles] = useState<
    Record<DesyncFileType, File | null>
  >({
    catar: null,
    caidx: null,
    caibx: null,
  });

  const [desyncUploadProgress, setDesyncUploadProgress] = useState<number>(0);
  const [isDesyncUploading, setIsDesyncUploading] = useState<boolean>(false);

  // 개별 Ref 생성 (버그 수정: 하나의 Ref 공유 문제 해결)
  const fileInputRefs = {
    poster: useRef<HTMLInputElement>(null),
    gameListBanner: useRef<HTMLInputElement>(null),
    gameIcon: useRef<HTMLInputElement>(null),
    gameImage: useRef<HTMLInputElement>(null),
  };

  // 통합된 Desync 파일 Input Ref
  const desyncFileInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 로컬 스토리지에서 캐시된 미리보기(Base64)가 있는지 확인
  useEffect(() => {
    const types: ImageType[] = [
      "poster",
      "gameListBanner",
      "gameIcon",
      "gameImage",
    ];
    types.forEach((type) => {
      const cached = localStorage.getItem(
        `${type}Preview_${game.gameBinaryName}`,
      );
      // gameListBanner의 경우, 기존 로직상 배너 미리보기가 없으면 포스터나 기존 이미지를 보여주지 않도록 null 체크를 신중히 함
      if (cached) {
        setPreviewUrls((prev) => ({ ...prev, [type]: cached }));
      }
    });

    if (bIsEditingExisting) {
      setTempYouTubeVideoId(game.gameVideoURL);
    }
  }, [bIsEditingExisting, game.gameBinaryName, game.gameVideoURL]);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: ImageType,
  ) {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl: string = URL.createObjectURL(file);

      setSelectedFiles((prev) => ({ ...prev, [imageType]: file }));
      setPreviewUrls((prev) => ({ ...prev, [imageType]: objectUrl }));

      // 로컬 스토리지 캐싱
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem(
          `${imageType}Preview_${game.gameBinaryName}`,
          base64String,
        );
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleUploadImage(imageType: ImageType) {
    const token = localStorage.getItem("accessToken");
    const selectedFile = selectedFiles[imageType];

    if (token && selectedFile && game.gameBinaryName.trim().length !== 0) {
      const result = await uploadGameImage(
        selectedFile,
        token,
        game.gameBinaryName,
        (percent) => {},
      );
      if (result.includes("dl")) {
        switch (imageType) {
          case "poster":
            setImage(0, result);
            break;
          case "gameListBanner":
            setImage(1, result);
            break;
          case "gameIcon":
            setImage(2, result);
            break;
          case "gameImage":
            // 0: poster, 1: banner, 2: icon, 3+: previews
            const newImages = [...game.gameImageURL];
            // 3번 인덱스(미리보기)부터 사용하기 위해 앞쪽이 비어있으면 채움
            while (newImages.length < 3) {
              newImages.push("");
            }

            // 3번 인덱스 이상에서 빈 문자열("")인 슬롯이 있다면 그곳에 삽입
            let inserted = false;
            for (let i = 3; i < newImages.length; i++) {
              if (newImages[i] === "") {
                newImages[i] = result;
                inserted = true;
                break;
              }
            }

            // 빈 슬롯을 찾지 못했다면 맨 뒤에 추가
            if (!inserted) {
              newImages.push(result);
            }

            updateImages(newImages);
            break;
        }
        // alert(`${imageType} 업로드 성공`);
      }
    } else {
      alert("파일을 먼저 선택해주세요.");
    }
  }

  function handleDesyncFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      setDesyncFiles((prev) => {
        const next = { ...prev };
        Array.from(files).forEach((file) => {
          const ext = file.name.split(".").pop()?.toLowerCase();
          if (ext === "catar") next.catar = file;
          else if (ext === "caidx") next.caidx = file;
          else if (ext === "caibx") next.caibx = file;
        });
        return next;
      });
    }
  }

  async function handleUploadDesync() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!desyncFiles.catar && !desyncFiles.caidx && !desyncFiles.caibx) {
      alert("업로드할 파일을 하나 이상 선택해주세요.");
      return;
    }

    if (game.gameId === 0) {
      alert("게임 ID가 유효하지 않습니다.");
      return;
    }

    setIsDesyncUploading(true);
    setDesyncUploadProgress(0);

    try {
      const fileEntries = Object.entries(desyncFiles).filter(
        ([, file]) => file !== null,
      ) as [DesyncFileType, File][];

      for (let i = 0; i < fileEntries.length; i++) {
        const [fileType, file] = fileEntries[i];
        const platform = game.gamePlatformWindows ? "windows" : "mac";

        const result = await uploadDesync(
          file,
          token,
          game.gameId,
          platform,
          game.gameLatestRevision || "1.0.0",
          (percent) => {
            // 전체 진행률 계산: 각 파일의 진행률을 전체에 반영
            const overallProgress = Math.round(
              ((i * 100 + percent) / (fileEntries.length * 100)) * 100,
            );
            setDesyncUploadProgress(overallProgress);
          },
        );

        if (result === "file-not-found" || result.includes("Error")) {
          alert(`${fileType} 업로드 실패: ${result}`);
        }
      }

      setDesyncUploadProgress(100);
      // 업로드 완료 후 파일 선택 초기화
      setDesyncFiles({ catar: null, caidx: null, caibx: null });
    } catch (error: any) {
      alert(`업로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsDesyncUploading(false);
    }
  }

  function setYouTubeTrailerId(id: string) {
    updateField("gameVideoURL", extractYoutubeId(id));
  }

  async function getCaidxList() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const caidxList = await getAllCaidxById(game.gameId.toString(), token);
      setExistingCaidxList(caidxList);
    }
  }

  useEffect(function () {
    getCaidxList();
  }, []);

  return (
    <>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          {/* caidx 업로더 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("gameCaidx")}</CardTitle>
              <CardDescription>
                {t.rich("gameCaidxDesc", {
                  link: (chunks) => (
                    <Text color="blue">
                      <Link
                        href="https://developer.prodbybitmap.com/ko/bitmap-api/upload-game"
                        target="_blank"
                      >
                        {chunks}
                      </Link>
                    </Text>
                  ),
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 통합 파일 선택 */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <TextField.Root
                    readOnly
                    placeholder={t("select-file-placeholder")}
                    value={[
                      desyncFiles.catar?.name,
                      desyncFiles.caidx?.name,
                      desyncFiles.caibx?.name,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    onClick={() => desyncFileInputRef.current?.click()}
                    className="cursor-pointer flex-1"
                  />
                  <Input
                    type="file"
                    multiple
                    ref={desyncFileInputRef}
                    onChange={handleDesyncFilesChange}
                    className="hidden"
                    accept=".catar,.caidx,.caibx"
                  />
                  <Button
                    variant="outline"
                    onClick={() => desyncFileInputRef.current?.click()}
                    disabled={isDesyncUploading}
                  >
                    {t("select-file")}
                  </Button>
                </div>
              </div>

              {/* 업로드 진행률 표시 */}
              {isDesyncUploading && (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300 ease-in-out rounded-full"
                      style={{ width: `${desyncUploadProgress}%` }}
                    />
                  </div>
                  <Text size="1" color="gray">
                    {t("uploading", { progress: desyncUploadProgress })}
                  </Text>
                </div>
              )}

              {/* 업로드된 caidx 리스트 */}
              {existingCaidxList && (
                <Flex direction="column" gap="2">
                  {existingCaidxList.files.map((fileName, index) => (
                    <Link
                      key={index}
                      href={`//api.prodbybitmap.com/games/caidx/${game.gameId}`}
                      target="_blank"
                      className={cn(
                        "flex-1 min-w-0 flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors",
                        "bg-accent text-accent-foreground",
                      )}
                    >
                      <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-muted flex items-center justify-center">
                        <Image
                          src={
                            fileName.includes("Windows") ? WindowsLogo : MacLogo
                          }
                          alt={game.gameTitle}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Text as="p" size="2" weight="medium" truncate>
                          {fileName}
                        </Text>
                        <Text as="p" size="1" color="gray" truncate>
                          {(() => {
                            const match = fileName.match(caidxParse);
                            if (match) {
                              return t("gameCaidxLists", {
                                gameTitle: game.gameTitle,
                                version: match[2],
                                platform: match[1],
                              });
                            }
                          })()}
                        </Text>
                      </div>
                    </Link>
                  ))}
                </Flex>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleUploadDesync()}
                disabled={
                  isDesyncUploading ||
                  (!desyncFiles.catar &&
                    !desyncFiles.caidx &&
                    !desyncFiles.caibx)
                }
              >
                {isDesyncUploading
                  ? `${desyncUploadProgress}%...`
                  : t("upload")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("gameVideoURL")}
                <Text color="red"> *</Text>
              </CardTitle>
              <CardDescription className="whitespace-pre-wrap">
                {t("gameVideoURLDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextField.Root
                value={tempYouTubeVideoId}
                onChange={(e) => setTempYouTubeVideoId(e.target.value)}
                placeholder="https://youtu.be/..."
              />
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setYouTubeTrailerId(tempYouTubeVideoId)}
                disabled={extractYoutubeId(tempYouTubeVideoId).length !== 11}
              >
                {t_common("apply")}
              </Button>
            </CardFooter>
          </Card>

          <Separator />

          {/* 게임 포스터 */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("gamePoster")}
                <Text color="red"> *</Text>
              </CardTitle>
              <CardDescription className="whitespace-pre-wrap">
                {t("gamePosterDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <TextField.Root
                  readOnly
                  placeholder={t("select-file-placeholder")}
                  value={selectedFiles.poster?.name || ""}
                  onClick={() => fileInputRefs.poster.current?.click()}
                  className="cursor-pointer"
                />
                <Input
                  type="file"
                  ref={fileInputRefs.poster}
                  onChange={(e) => handleFileChange(e, "poster")}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRefs.poster.current?.click()}
                >
                  {t("select-file")}
                </Button>
              </div>

              {(previewUrls.poster || game.gameImageURL[0]) && (
                <div className="relative w-48 aspect-[1/1.414] rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={previewUrls.poster || game.gameImageURL[0]}
                    alt="Poster Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {previewUrls.poster
                      ? t("local-preview")
                      : t("server-image")}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleUploadImage("poster")}
                disabled={!selectedFiles.poster}
              >
                {t("upload")}
              </Button>
            </CardFooter>
          </Card>

          <Separator />

          {/* 게임 배너 이미지 */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t("gameBannerImage")}
                <Text color="red"> *</Text>
              </CardTitle>
              <CardDescription className="whitespace-pre-wrap">
                {t("gameBannerImageDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <TextField.Root
                  readOnly
                  placeholder={t("select-file-placeholder")}
                  value={selectedFiles.gameListBanner?.name || ""}
                  onClick={() => fileInputRefs.gameListBanner.current?.click()}
                  className="cursor-pointer"
                />
                <Input
                  type="file"
                  ref={fileInputRefs.gameListBanner}
                  onChange={(e) => handleFileChange(e, "gameListBanner")}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRefs.gameListBanner.current?.click()}
                >
                  {t("select-file")}
                </Button>
              </div>

              {/* 미리보기 영역: 업로드 전/후 상태를 시각적으로 보여줌 */}
              <div className="flex gap-4 pb-4">
                <GameRedirectButton
                  disabled={true}
                  gameId={game.gameId}
                  gameImageURL={
                    previewUrls.gameListBanner ||
                    game.gameImageURL[1] ||
                    game.gameImageURL[0] ||
                    ""
                  }
                  gameTitle={game.gameTitle}
                  gameDeveloper={game.gameDeveloper}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleUploadImage("gameListBanner")}
                disabled={!selectedFiles.gameListBanner}
              >
                {t("upload")}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("gamePreviewImage")}
                <Text color="red"> *</Text>
              </CardTitle>
              <CardDescription className="whitespace-pre-wrap">
                {t("gamePreviewImageDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <TextField.Root
                  readOnly
                  placeholder={t("select-file-placeholder")}
                  value={selectedFiles.gameImage?.name || ""}
                  onClick={() => fileInputRefs.gameImage.current?.click()}
                  className="cursor-pointer"
                />
                <Input
                  type="file"
                  ref={fileInputRefs.gameImage}
                  onChange={(e) => handleFileChange(e, "gameImage")}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRefs.gameImage.current?.click()}
                >
                  {t("select-file")}
                </Button>
              </div>

              {previewUrls.gameImage && (
                <div className="relative w-48 aspect-video rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={previewUrls.gameImage}
                    alt="Preview Image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {t("local-preview")}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleUploadImage("gameImage")}
                disabled={!selectedFiles.gameImage}
              >
                {t("upload-append")}
              </Button>
            </CardFooter>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>{t("preview")}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 하단 전체 미리보기 (기존 유지 및  {t("local-preview")} 반영) */}
              <div className="space-y-6">
                <ScrollArea type="always" scrollbars="horizontal">
                  <div className="flex gap-4 pb-4">
                    {/*  {t("local-preview")}가 있으면 가장 앞에 표시 */}
                    {game.gameVideoURL && (
                      <div className="shrink-0 w-[85vw] md:w-[500px] aspect-video relative rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={`https://www.youtube.com/embed/${game.gameVideoURL}`}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    )}
                    {/*{game.gameImageURL[0] === "" && previewUrl && (
                      <div className="shrink-0 w-[85vw] md:w-[500px] aspect-video relative rounded-lg overflow-hidden ring-4 ring-primary">
                        <Image
                          src={previewUrl}
                          alt="Local Preview"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-bold text-lg">
                          업로드 대기 중
                        </div>
                      </div>
                    )}*/}
                    {/* 기존 서버 이미지들 */}
                    {game.gameImageURL.slice(3).map(
                      (url, index) =>
                        imageUriRegExp.test(url) && (
                          <div
                            key={index}
                            className="shrink-0 w-[85vw] md:w-[500px] aspect-video relative rounded-lg overflow-hidden bg-muted"
                          >
                            <Image
                              src={url}
                              alt={`Screenshot ${index}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ),
                    )}
                  </div>
                </ScrollArea>
              </div>
              <Separator />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
