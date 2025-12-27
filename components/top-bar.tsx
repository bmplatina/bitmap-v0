"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { MobileSidebar } from "./mobile-sidebar";
import type { Game } from "../lib/types";
import { getGames } from "../lib/utils";
import { convertQwertyToHangul, getChoseong } from "es-hangul";

export default function TopBar() {
  // Electron 및 MacOS 환경 감지 변수 (실제 감지 코드는 구현하지 않음)
  const bIsElectron: boolean = false; // 예시 값, 실제로는 Electron 감지 로직 필요
  const bIsMacOS: boolean = false; // 예시 값, 실제로는 MacOS 감지 로직 필요

  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  // 검색 대상 게임 캐시
  const [games, setGames] = useState<Game[]>([]);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  // 모바일 사이드바 상태 관리
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getGames()
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
  }, [searchQuery, games]);

  const searchSummary = useMemo(() => {
    if (!searchQuery.trim()) return "";
    return `${searchResults.length}건의 결과`;
  }, [searchQuery, searchResults]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.table(
      searchResults.map((game) => ({
        Title: game.gameTitle,
        Developer: game.gameDeveloper,
        Publisher: game.gamePublisher,
      }))
    );
  };

  // 모바일 사이드바 토글
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // 모바일 사이드바 닫기
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      <div className="h-12 bg-background border-b flex items-center px-4 w-full relative z-50">
        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden mr-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </div>

        {/* 로고 이미지 */}
        <Link href="/" className="flex items-center">
          <Image
            src="/bitmap_bmp.png"
            alt="Bitmap"
            width={120}
            height={32}
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            priority
            style={{
              mixBlendMode: "difference",
            }}
          />
        </Link>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="게임 검색..."
              className="pl-9 h-9 w-full bg-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* 검색 결과 건수 */}
        <div className="hidden md:flex w-[160px] justify-end text-xs text-muted-foreground">
          {searchSummary}
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
          <div className="fixed left-0 top-0 h-full w-64 bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out">
            {/* 사이드바 헤더 */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">메뉴</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={closeMobileSidebar}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">메뉴 닫기</span>
              </Button>
            </div>

            {/* 사이드바 콘텐츠 */}
            <MobileSidebar onItemClick={closeMobileSidebar} />
          </div>
        </div>
      )}
    </>
  );
}
