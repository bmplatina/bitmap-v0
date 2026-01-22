"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/AuthContext";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Button,
  AlertDialog,
  Flex,
  IconButton,
  Text,
  TextArea,
  TextField,
  Theme,
} from "@radix-ui/themes";
import { submitGameRate } from "@/lib/games";
import type { GameRating, GameRatingRequest } from "@/lib/types";
import { Star } from "lucide-react";

type GameIdProps = {
  gameId: number;
  bIsEditing: boolean;
  rates: GameRating[];
};

export default function GameRateSubmitter({
  gameId,
  bIsEditing,
  rates,
}: GameIdProps) {
  const t = useTranslations("GamesView");
  const { bIsLoggedIn, uid } = useAuth();

  const [bIsAlreadySubmitted, setIsAlreadySubmitted] = useState(false);

  useEffect(() => {
    const existingRate = rates.find(
      (rate) => rate.uid === uid && rate.gameId === gameId,
    );
    if (existingRate) {
      if (!bIsEditing) {
        setIsAlreadySubmitted(true);
      }
    }
  }, [bIsEditing, rates, gameId]);

  if (!bIsLoggedIn || bIsAlreadySubmitted) return null;

  return (
    <>
      {bIsEditing ? (
        <Flex gap="3" mt="4" justify="end">
          <Popover>
            <PopoverTrigger asChild>
              <Button>
                <Text>{t("rate-edit")}</Text>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-32px)] sm:w-[480px]">
              <GameRateCard
                gameId={gameId}
                bIsEditing={bIsEditing}
                rates={rates}
              ></GameRateCard>
            </PopoverContent>
          </Popover>
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button color="red">삭제</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title>평점 삭제</AlertDialog.Title>
              <AlertDialog.Description size="2">
                Are you sure? This application will no longer be accessible and
                any existing sessions will be expired.
              </AlertDialog.Description>

              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="solid" color="red">
                    Revoke access
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </Flex>
      ) : (
        <div className="my-2">
          <GameRateCard gameId={gameId} bIsEditing={bIsEditing} rates={rates} />
        </div>
      )}
    </>
  );
}

function GameRateCard({ gameId, bIsEditing, rates }: GameIdProps) {
  const t = useTranslations("GamesView");
  const router = useRouter();
  const { uid } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [postFailMessage, setPostFailMessage] = useState<string>("");

  async function submitHandler() {
    try {
      const storageToken = localStorage.getItem("accessToken");
      if (!storageToken) throw Error("login-required");

      if (title.length === 0) throw Error("title-required");
      if (content.length === 0) throw Error("content-required");
      if (rating <= 0 || rating > 5) throw Error("rating-required");

      const newRate: GameRatingRequest = {
        gameId: gameId,
        uid: uid,
        rating: rating,
        title: title,
        content: content,
      };

      await submitGameRate(storageToken, newRate, bIsEditing);
      router.refresh();
    } catch (err: any) {
      setPostFailMessage(err.message || String(err));
      console.error(err);
    }
  }

  useEffect(() => {
    const existingRate = rates.find(
      (rate) => rate.uid === uid && rate.gameId === gameId,
    );
    if (existingRate) {
      if (bIsEditing) {
        setTitle(existingRate.title ?? "");
        setContent(existingRate.content);
        setRating(existingRate.rating);
      }
    }
  }, [bIsEditing, rates, uid, gameId]);

  return (
    <Theme>
      <Card>
        <CardHeader>
          <CardTitle>
            <Text>{bIsEditing ? t("rate-edit") : t("new-rate")}</Text>
            <TextField.Root
              placeholder={t("rate-title")}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            >
              <TextField.Slot></TextField.Slot>
            </TextField.Root>
          </CardTitle>
          <CardDescription>
            <Flex gap="2" className="mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <IconButton
                  key={i + 1}
                  variant="ghost"
                  radius="full"
                  onClick={() => setRating(i + 1)}
                >
                  <Star
                    color="orange"
                    fill={i + 1 <= rating ? "yellow" : "none"}
                  />
                </IconButton>
              ))}
            </Flex>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TextArea
            placeholder={t("rate-description")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></TextArea>
          {postFailMessage && (
            <Text color="red" as="p">
              {t(postFailMessage)}
            </Text>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => submitHandler()}>
            <Text>{bIsEditing ? t("rate-edit") : t("rate-submit")}</Text>
          </Button>
        </CardFooter>
      </Card>
    </Theme>
  );
}
