"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  Button,
  Flex,
  IconButton,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import { submitGameRate } from "@/lib/games";
import type { GameRatingRequest } from "@/lib/types";
import { Star } from "lucide-react";

type GameIdProps = {
  gameId: number;
  bIsEditing: boolean;
};

export default function GameRateSubmitter({ gameId, bIsEditing }: GameIdProps) {
  const t = useTranslations("GamesView");
  const locale = useLocale();
  const { uid, bIsLoggedIn } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [postFailMessage, setPostFailMessage] = useState<string>("");

  async function submitHandler(bIsUpdating: boolean) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw Error("login-required");

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

      await submitGameRate(token, newRate, bIsUpdating);
    } catch (err: any) {
      setPostFailMessage(err.message || String(err));
      console.error(err);
    }
  }

  if (!bIsLoggedIn) return null;

  return (
    <div className="my-2">
      <Card>
        <CardHeader>
          <CardTitle>
            <Text>평점 남기기</Text>
            <TextField.Root
              placeholder="Title…"
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
            placeholder="Reply to comment…"
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
          <Button onClick={() => submitHandler(false)}>
            <Text>Submit</Text>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
