"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import semver from "semver";
import type { Game, stringLocalized } from "@/lib/types";

interface GameFormContextType {
  gameData: Game;
  // 일반 필드 업데이트 (문자열, 숫자 등)
  updateField: <K extends keyof Game>(field: K, value: Game[K]) => void;
  // Localized 필드 업데이트 (gameDescription, gameHeadline 등)
  updateLocalizedField: (
    field: "gameGenre" | "gameHeadline" | "gameDescription",
    lang: keyof stringLocalized,
    value: string,
  ) => void;
  // 이미지 배열 업데이트
  updateImages: (urls: string[]) => void;
  // 특정 인덱스 이미지 업데이트 (없으면 추가/할당)
  setImage: (arrayIndex: number, arrayElement: string) => void;
  resetForm: () => void;
  setGame: (game: Game) => void;
  setIsEditingExisting: (bIsEditing: boolean) => void;
  bIsEditingExisting: boolean;
  bIsGameDataDirty: boolean;
  bIsSemverValid: boolean;
  getIsStoreviewEditorFieldAllValid: () => boolean;
  getIsDetailEditorFieldAllValid: () => boolean;
}

const initialGameData: Game = {
  gameId: 0,
  uid: "",
  isApproved: false,
  gameTitle: "",
  gameLatestRevision: "0.0",
  gamePlatformWindows: false,
  gamePlatformMac: false,
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
  requirementsMac: "",
  gameDownloadWinURL: null,
  requirementsWindows: "",
  gameImageURL: [],
  gameBinaryName: "",
  gameHeadline: { ko: "", en: "" },
  gameDescription: { ko: "", en: "" },
  ageRating: 0,
  ratingContentDescriptors: [],
  customEula: "",
};

const GameFormContext = createContext<GameFormContextType | undefined>(
  undefined,
);

export function GamePublishProvider({ children }: { children: ReactNode }) {
  const [gameData, setGameData] = useState<Game>(initialGameData);
  const [bIsEditingExisting, setIsEditingExistingEffect] =
    useState<boolean>(false);
  const originalGameDataRef = useRef<Game | null>(null);

  // 1. 일반 필드 업데이트
  const updateField = useCallback(
    <K extends keyof Game>(field: K, value: Game[K]) => {
      setGameData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // 2. 다국어(ko/en) 필드 전용 업데이트
  const updateLocalizedField = useCallback(
    (
      field: "gameGenre" | "gameHeadline" | "gameDescription",
      lang: keyof stringLocalized,
      value: string,
    ) => {
      setGameData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
    },
    [],
  );

  // 3. 이미지 배열 전체 업데이트
  const updateImages = useCallback((urls: string[]) => {
    setGameData((prev) => ({ ...prev, gameImageURL: urls }));
  }, []);

  // 4. 특정 인덱스 이미지 업데이트 (존재하면 교체, 없으면 해당 인덱스에 할당/확장)
  const setImage = useCallback((arrayIndex: number, arrayElement: string) => {
    setGameData((prev) => {
      const newImages = [...prev.gameImageURL];
      // 해당 인덱스에 값 할당 (배열 길이가 모자르면 자동으로 늘어남)
      newImages[arrayIndex] = arrayElement;
      // 빈 슬롯(undefined) 제거를 원한다면: return { ...prev, gameImageURL: newImages.filter(Boolean) };
      return { ...prev, gameImageURL: newImages };
    });
  }, []);

  const setGame = useCallback((game: Game) => {
    setGameData(game);
    originalGameDataRef.current = structuredClone(game);
  }, []);

  const resetForm = useCallback(() => setGameData(initialGameData), []);

  const setIsEditingExisting = useCallback((bIsEditing: boolean) => {
    setIsEditingExistingEffect(bIsEditing);
  }, []);

  const getIsStoreviewEditorFieldAllValid = useCallback(() => {
    return (
      gameData.gameTitle.length > 0 &&
      gameData.gameHeadline.ko.length > 0 &&
      gameData.gameHeadline.en.length > 0 &&
      gameData.gameDeveloper.length > 0 &&
      gameData.gamePublisher.length > 0 &&
      gameData.gameGenre.ko.length > 0 &&
      gameData.gameGenre.en.length > 0 &&
      gameData.gameReleasedDate.length > 0 &&
      gameData.gameDescription.ko.length > 0 &&
      gameData.gameDescription.en.length > 0 &&
      ((gameData.gamePlatformWindows &&
        (gameData.requirementsWindows?.length ?? 0) > 0) ||
        (gameData.gamePlatformMac &&
          (gameData.requirementsMac?.length ?? 0) > 0))
    );
  }, [gameData]);

  const getIsDetailEditorFieldAllValid = useCallback(() => {
    const bIsWindowsDownloadURIValid: boolean = gameData.gamePlatformWindows
      ? (gameData.gameDownloadWinURL?.length ?? 0) > 0
      : true;
    const bIsMacDownloadURIValid: boolean = gameData.gamePlatformMac
      ? (gameData.gameDownloadMacURL?.length ?? 0) > 0
      : true;

    return (
      gameData.gameId >= 0 &&
      gameData.gameLatestRevision !== "" &&
      gameData.gameEngine.length > 0 &&
      gameData.gameWebsite.length > 0 &&
      bIsWindowsDownloadURIValid &&
      bIsMacDownloadURIValid &&
      gameData.gameBinaryName.length > 0
    );
  }, [gameData]);

  // 원본 데이터 대비 변경 여부 감지
  const bIsGameDataDirty = useMemo(() => {
    if (!originalGameDataRef.current) return true; // 새 게임이면 항상 dirty
    return JSON.stringify(gameData) !== JSON.stringify(originalGameDataRef.current);
  }, [gameData]);

  // SemVer 유효성 검사
  const bIsSemverValid = useMemo(() => {
    return semver.valid(gameData.gameLatestRevision) !== null;
  }, [gameData.gameLatestRevision]);

  return (
    <GameFormContext.Provider
      value={{
        gameData,
        updateField,
        updateLocalizedField,
        updateImages,
        setImage,
        resetForm,
        setGame,
        setIsEditingExisting,
        bIsEditingExisting,
        bIsGameDataDirty,
        bIsSemverValid,
        getIsStoreviewEditorFieldAllValid,
        getIsDetailEditorFieldAllValid,
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
