"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ScrollArea, Skeleton } from "@radix-ui/themes"; // @radix-ui/themes 사용
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useGameForm } from "@/lib/GamePublishContext";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { extractYoutubeId, uploadGameImage } from "@/lib/utils";

const GameRedirectButton = dynamic(
  () => import("@/components/games/game-redirect-button"),
  {
    ssr: false,
    loading: () => <Skeleton />,
  }
);

export default function GameAssetsUploader() {
  const t = useTranslations("GameSubmit");
  const t_common = useTranslations("Common");
  const { gameData: game, updateField, setImage, updateImages } = useGameForm();

  const [tempYouTubeVideoId, setTempYouTubeVideoId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 로컬 스토리지에서 캐시된 미리보기(Base64)가 있는지 확인
  useEffect(() => {
    const cachedImage = localStorage.getItem(`preview_${game.gameBinaryName}`);
    if (cachedImage) {
      setPreviewUrl(cachedImage);
    }
  }, [game.gameBinaryName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // 즉각적인 미리보기를 위한 URL 생성
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // (선택 사항) 로컬 스토리지에 Base64로 저장하여 새로고침 시에도 유지하고 싶다면:
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem(`preview_${game.gameBinaryName}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleUpload(
    imageType: "poster" | "gameListBanner" | "gameImage"
  ) {
    const token = localStorage.getItem("accessToken");
    if (token && selectedFile && game.gameBinaryName.trim().length !== 0) {
      const result = await uploadGameImage(
        selectedFile,
        token,
        game.gameBinaryName,
        (percent) => {}
      );
      if (result.includes("dl")) {
        switch (imageType) {
          case "poster":
            setImage(0, result);
            break;
          case "gameListBanner":
            setImage(1, result);
            break;
          case "gameImage":
            updateImages([...game.gameImageURL, result]);
            break;
        }
      }
    } else {
      alert("파일을 먼저 선택해주세요.");
    }
  }

  function setYouTubeTrailerId(id: string) {
    updateField("gameVideoURL", extractYoutubeId(id));
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* 유튜브 트레일러 섹션 (기존 유지) */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameVideoURL")}</CardTitle>
            <CardDescription>{t("gameVideoURLDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
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

        {/* 파일 업로드 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gamePoster")}</CardTitle>
            <CardDescription>
              {t("gamePosterDesc")} (권장 1:1.414, Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                placeholder="파일을 선택하세요..."
                value={selectedFile?.name || ""}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                파일 선택
              </Button>
            </div>

            {(previewUrl || game.gameImageURL[0]) && (
              <div className="relative w-48 aspect-[1/1.414] rounded-lg overflow-hidden border bg-muted">
                <Image
                  src={previewUrl || game.gameImageURL[0]}
                  alt="Poster Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {previewUrl ? "로컬 미리보기" : "서버 이미지"}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleUpload("poster")}
              disabled={!selectedFile}
            >
              서버로 업로드
            </Button>
          </CardFooter>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>{t("preview")}</CardTitle>
            <CardDescription>{t("gameVideoURLDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 하단 전체 미리보기 (기존 유지 및 로컬 미리보기 반영) */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">{t("preview")}</h3>
              <ScrollArea type="always" scrollbars="horizontal">
                <div className="flex gap-4 pb-4">
                  {/* 로컬 미리보기가 있으면 가장 앞에 표시 */}
                  {game.gameVideoURL && (
                    <div className="shrink-0 w-[85vw] md:w-[500px] aspect-video relative rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={`https://www.youtube.com/embed/${game.gameVideoURL}`}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {game.gameImageURL[0] === "" && previewUrl && (
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
                  )}
                  {/* 기존 서버 이미지들 */}
                  {game.gameImageURL.map((url, index) => (
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
                  ))}
                </div>
              </ScrollArea>
            </div>
            <Separator />
            {/* 미리보기 영역: 업로드 전/후 상태를 시각적으로 보여줌 */}
            <div className="flex gap-4 pb-4">
              <GameRedirectButton
                disabled={true}
                game={game}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
