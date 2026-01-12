"use client";

import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ScrollArea, Skeleton, Progress, Text } from "@radix-ui/themes";
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
import { extractYoutubeId } from "@/lib/utils";

const GameRedirectButton = dynamic(
  () => import("@/components/game-redirect-button"),
  {
    ssr: false,
    loading: () => <Skeleton />, // 로딩 중 보여줄 UI
  }
);

export default function GameAssetsUploader() {
  const t = useTranslations("GameSubmit");
  const t_common = useTranslations("Common");
  const {
    gameData: game,
    updateField,
    updateLocalizedField,
    updateImages,
    resetForm,
  } = useGameForm();

  const [tempYouTubeVideoId, setTempYouTubeVideoId] = useState<string>("");

  function setYouTubeTrailerId(id: string) {
    updateField("gameVideoURL", extractYoutubeId(id));
  }

  function isYouTubeLinkValid() {
    return extractYoutubeId(tempYouTubeVideoId).length === 11;
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // 파일 처리 로직
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* 비디오 URL */}
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
              type="url"
            />
            {game.gameVideoURL.length === 11 && (
              <div className="mt-4 shrink-0 w-[85vw] md:w-[500px] aspect-video relative rounded-lg overflow-hidden bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${game.gameVideoURL}`}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setYouTubeTrailerId(tempYouTubeVideoId)}
              disabled={!isYouTubeLinkValid()}
            >
              {t_common("apply")}
            </Button>
          </CardFooter>
        </Card>

        <Separator />

        {/* 이미지 URL */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gamePoster")}</CardTitle>
            <CardDescription>
              {t("gamePosterDesc")}
              <br />
              (1:1.414 비율 권장, 최대 10MiB 업로드 가능)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "active" : ""}`}
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Text as="p">파일을 여기에 놓으세요!</Text>
              ) : (
                <Text as="p">파일을 드래그하거나 클릭하여 선택하세요.</Text>
              )}

              {/* 업로드 상태 표시 시 Radix Progress 사용 */}
              <Progress value={25} size="1" />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* 이미지 URL */}
        <Card>
          <CardHeader>
            <CardTitle>{t("gameListedImage")}</CardTitle>
            <CardDescription>{t("gameListedImageDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`dropzone ${isDragActive ? "active" : ""}`}
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Text as="p">파일을 여기에 놓으세요!</Text>
              ) : (
                <Text as="p">파일을 드래그하거나 클릭하여 선택하세요.</Text>
              )}

              {/* 업로드 상태 표시 시 Radix Progress 사용 */}
              <Progress value={25} size="1" />
            </div>
            <div className="flex gap-4 pb-4">
              <GameRedirectButton disabled={true} game={game} />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="space-y-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{t("preview")}</h3>
            <ScrollArea type="always" scrollbars="horizontal">
              <div className="flex gap-4 pb-4">
                <Card className=""></Card>
                {game.gameVideoURL && (
                  <div className="shrink-0 w-[85vw] md:w-[500px] aspect-video relative rounded-lg overflow-hidden bg-muted">
                    <iframe
                      src={`https://www.youtube.com/embed/${game.gameVideoURL}`}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
                {game.gameImageURL.slice(1).map((url, index) => (
                  <div
                    key={index}
                    className="shrink-0 w-[85vw] md:w-[500px] aspect-video relative rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={url}
                      alt={`${game.gameTitle} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
