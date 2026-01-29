"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { MobileSidebar } from "./mobile-sidebar";
import type { Game } from "@/lib/types";
import { getGames } from "@/lib/games";
import { useTranslations } from "next-intl";
import { convertQwertyToHangul, getChoseong } from "es-hangul";
import { Avatar, Button, IconButton, Popover, Spinner } from "@radix-ui/themes";
import ProfilePopover from "@/components/accounts/profile";
import GameListView from "@/components/games/game-listview";
import { useAuth } from "@/lib/AuthContext";

import BitmapLogoBMP from "@/public/bitmap_bmp.png";

export default function TopBar() {
  const router = useRouter();
  const t = useTranslations("Common");
  const pathName = usePathname();
  const { bIsLoggedIn, username, isLoading } = useAuth();
  // Electron 및 MacOS 환경 감지 변수 (실제 감지 코드는 구현하지 않음)
  const bIsElectron: boolean = false; // 예시 값, 실제로는 Electron 감지 로직 필요
  const bIsMacOS: boolean = false; // 예시 값, 실제로는 MacOS 감지 로직 필요

  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  // 검색 대상 게임 캐시
  const [games, setGames] = useState<Game[]>([]);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // 모바일 사이드바 상태 관리
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // 모바일 검색창 상태 관리
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  // 프로필 팝오버 상태 관리
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 라우트 변경 시 팝오버 및 사이드바 닫기
  useEffect(() => {
    setIsProfileOpen(false);
    setIsMobileSidebarOpen(false);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  }, [pathName]);

  useEffect(() => {
    let isMounted = true;

    getGames("released")
      .then((data) => {
        if (!isMounted) return;
        setGames(data);
        setSearchResults(data);
      })
      .catch((error) => {
        console.error("게임 데이터를 불러오지 못했습니다.", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(games);
      return;
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const hangulCandidate = convertQwertyToHangul(normalizedQuery);
    const chosungCandidate = getChoseong(hangulCandidate || normalizedQuery);

    const filtered = games.filter((game) => {
      const targets = [game.gameTitle, game.gameDeveloper, game.gamePublisher];

      return targets.some((target) => {
        if (!target) return false;
        const normalizedTarget = target.toLowerCase();
        const targetChoseong = getChoseong(normalizedTarget);

        return (
          normalizedTarget.includes(normalizedQuery) ||
          (hangulCandidate && normalizedTarget.includes(hangulCandidate)) ||
          (chosungCandidate && targetChoseong.includes(chosungCandidate))
        );
      });
    });

    setSearchResults(filtered);
    setIsSearchOpen(true);
  }, [searchQuery, games]);

  const searchSummary = useMemo(() => {
    if (!searchQuery.trim()) return "";
    return `${searchResults.length}건의 결과`;
  }, [searchQuery, searchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".max-w-md")) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      router.push(`/games/${firstResult.gameId}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsMobileSearchOpen(false);
    }
  };

  // 모바일 사이드바 토글
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // 모바일 사이드바 닫기
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  function getIsSigninButtonActive(): boolean {
    const authPageRegExp: RegExp = /^\/auth/;
    return !authPageRegExp.test(pathName) && !bIsLoggedIn;
  }

  return (
    <>
      <div
        className={`h-12 border-b flex items-center px-4 w-full relative z-50 transition-all duration-300 ${
          isScrolled ? "border-border/50" : "bg-background border-border"
        }`}
        style={
          isScrolled
            ? {
                WebkitBackdropFilter: "saturate(180%) blur(20px)",
                backdropFilter: "saturate(180%) blur(20px)",
                backgroundColor: "var(--topbar-bg, rgba(255, 255, 255, 0.72))",
              }
            : {}
        }
      >
        {/* 모바일 메뉴 버튼 */}
        <div className={`md:hidden mr-3 ${isMobileSearchOpen ? "hidden" : ""}`}>
          <IconButton
            variant="ghost"
            radius="full"
            className="h-8 w-8"
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("open-menu")}</span>
          </IconButton>
        </div>

        {/* 로고 이미지 */}
        <Link
          href="/"
          className={`flex items-center ${
            isMobileSearchOpen ? "hidden md:flex" : ""
          }`}
        >
          <Image
            src={BitmapLogoBMP}
            alt="Bitmap"
            width={120}
            height={32}
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity invert dark:invert-0 object-contain"
            priority
          />
        </Link>

        {/* 검색 폼 */}
        <div
          className={`max-w-md mx-auto ${
            isMobileSearchOpen
              ? "flex-1 relative block"
              : "hidden md:block md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full"
          }`}
        >
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("store-filter")}
                className="pl-9 h-9 w-full bg-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
              />
            </div>
          </form>

          {/* 검색 결과 드롭다운 */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
              {/* 검색 결과 건수 */}
              <div className="hidden md:flex w-[160px] justify-end text-xs text-muted-foreground">
                {searchSummary}
              </div>
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((game) => (
                    <GameListView
                      key={game.gameId}
                      game={game}
                      bIsPublishingMode={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {t("search-no-results")}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ml-auto pl-2 flex items-center gap-2">
          {/* 모바일 검색 토글 버튼 */}
          <div className="md:hidden flex items-center">
            <IconButton
              variant="ghost"
              radius="full"
              className="h-8 w-8"
              onClick={() => {
                if (isMobileSearchOpen) {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }
                setIsMobileSearchOpen(!isMobileSearchOpen);
              }}
            >
              {isMobileSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              <span className="sr-only">{t("search-toggle")}</span>
            </IconButton>
          </div>
          <div className="flex items-center">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {bIsLoggedIn && (
                  <Popover.Root
                    open={isProfileOpen}
                    onOpenChange={setIsProfileOpen}
                  >
                    <Popover.Trigger>
                      <IconButton variant="ghost" radius="full">
                        <Avatar
                          radius="full"
                          size="2"
                          fallback={username.charAt(0).toUpperCase()}
                        />
                      </IconButton>
                    </Popover.Trigger>
                    <Popover.Content
                      style={{
                        WebkitBackdropFilter: "saturate(180%) blur(20px)",
                        backdropFilter: "saturate(180%) blur(20px)",
                        backgroundColor:
                          "var(--topbar-bg, rgba(255, 255, 255, 0.72))",
                      }}
                    >
                      <ProfilePopover />
                    </Popover.Content>
                  </Popover.Root>
                )}
                {getIsSigninButtonActive() && (
                  <Button radius="full" asChild>
                    <Link href="/auth">{t("signin")}</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 사이드바 오버레이 */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeMobileSidebar}
          />

          {/* 사이드바 */}
          <div
            className={`fixed left-0 top-0 h-full w-64 border-r shadow-lg transform transition-transform duration-300 ease-in-out ${
              isScrolled ? "border-border/50" : "bg-background border-border"
            } flex flex-col`}
            style={{
              WebkitBackdropFilter: "saturate(180%) blur(20px)",
              backdropFilter: "saturate(180%) blur(20px)",
              backgroundColor: "var(--topbar-bg, rgba(255, 255, 255, 0.72))",
            }}
          >
            {/* 사이드바 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{t("menu")}</h2>
              <IconButton
                variant="ghost"
                className="h-8 w-8"
                radius="full"
                onClick={closeMobileSidebar}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">{t("close-menu")}</span>
              </IconButton>
            </div>

            {/* 사이드바 콘텐츠 */}
            <MobileSidebar onItemClick={closeMobileSidebar} />
          </div>
        </div>
      )}
    </>
  );
}
