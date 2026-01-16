"use client";

import GameDetail from "@/components/games/game-details-pending";
import { useTranslations } from "next-intl";
import { useGameForm } from "@/lib/GamePublishContext";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { submitGame } from "@/lib/games";
import { useEffect, useState } from "react";

export default function gamePublishSubmitter() {
  const t = useTranslations("GameSubmit");
  const { gameData: game, bIsEditingExisting } = useGameForm();
  const { uid } = useAuth();

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // You can add any side effects or subscriptions here if needed
    setToken(localStorage.getItem("accessToken") || "");
  }, []);

  return (
    <>
      <Button onClick={() => submitGame(token, game)}>
        {bIsEditingExisting ? t("edit") : t("submit")}
      </Button>
      <GameDetail
        game={game}
        uid={uid}
        submitState={bIsEditingExisting ? "editExisting" : "submitNew"}
      />
    </>
  );
}
