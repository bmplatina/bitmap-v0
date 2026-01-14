"use client";

import GameDetail from "@/components/games/game-details-pending";
import { useTranslations } from "next-intl";
import { useGameForm } from "@/lib/GamePublishContext";
import { Button } from "@/components/ui/button";
import { submitGame } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function gamePublishSubmitter() {
  const t = useTranslations("GameSubmit");
  const {
    gameData: game,
    updateField,
    updateLocalizedField,
    updateImages,
    resetForm,
  } = useGameForm();

  const [token, setToken] = useState<string>("");

  function setYouTubeTrailerId(id: string) {
    updateField("gameVideoURL", id);
  }

  useEffect(() => {
    // You can add any side effects or subscriptions here if needed
    setToken(localStorage.getItem("accessToken") || "");
  }, []);

  return (
    <>
      <Button onClick={() => submitGame(token, game)}>{t("submit")}</Button>
      <GameDetail game={game} uid="" />
    </>
  );
}
