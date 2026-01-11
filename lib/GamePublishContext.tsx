"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import type { Game, stringLocalized } from "@/lib/types";

interface GameFormContextType {
  gameData: Game;
  // 일반 필드 업데이트 (문자열, 숫자 등)
  updateField: <K extends keyof Game>(field: K, value: Game[K]) => void;
  // Localized 필드 업데이트 (gameDescription, gameHeadline 등)
  updateLocalizedField: (
    field: "gameGenre" | "gameHeadline" | "gameDescription",
    lang: keyof stringLocalized,
    value: string
  ) => void;
  // 이미지 배열 업데이트
  updateImages: (urls: string[]) => void;
  resetForm: () => void;
}

const initialGameData: Game = {
  gameId: 0,
  uid: "",
  gameTitle: "",
  gameLatestRevision: 1,
  gamePlatformWindows: false,
  gamePlatformMac: false,
  gamePlatformMobile: false,
  gameEngine: "",
  gameGenre: { ko: "", en: "" },
  gameDeveloper: "",
  gamePublisher: "",
  isEarlyAccess: false,
  isReleased: false,
  gameReleasedDate: new Date().toISOString().split("T")[0],
  gameWebsite: "",
  gameVideoURL: "",
  gameDownloadMacURL: null,
  gameDownloadWinURL: null,
  gameImageURL: [],
  gameBinaryName: "",
  gameHeadline: { ko: "", en: "" },
  gameDescription: { ko: "", en: "" },
};

const GameFormContext = createContext<GameFormContextType | undefined>(
  undefined
);

export function GamePublishProvider({ children }: { children: ReactNode }) {
  const [gameData, setGameData] = useState<Game>(initialGameData);

  // 1. 일반 필드 업데이트
  const updateField = useCallback(
    <K extends keyof Game>(field: K, value: Game[K]) => {
      setGameData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 2. 다국어(ko/en) 필드 전용 업데이트
  const updateLocalizedField = useCallback(
    (
      field: "gameGenre" | "gameHeadline" | "gameDescription",
      lang: keyof stringLocalized,
      value: string
    ) => {
      setGameData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
    },
    []
  );

  // 3. 이미지 배열 업데이트
  const updateImages = useCallback((urls: string[]) => {
    setGameData((prev) => ({ ...prev, gameImageURL: urls }));
  }, []);

  const resetForm = useCallback(() => setGameData(initialGameData), []);

  return (
    <GameFormContext.Provider
      value={{
        gameData,
        updateField,
        updateLocalizedField,
        updateImages,
        resetForm,
      }}
    >
      {children}
    </GameFormContext.Provider>
  );
}

export const useGameForm = () => {
  const context = useContext(GameFormContext);
  if (!context)
    throw new Error("useGameForm must be used within a GameFormProvider");
  return context;
};
