"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "@/i18n/routing";
import { Search as SearchIcon } from "lucide-react";
import type { Game, DocumentArchives } from "@/lib/types";
import GameListView from "@/components/games/game-listview";
import ArchiveListView from "../archive-search-listview";
import { useTranslations } from "next-intl";
import { convertQwertyToHangul, getChoseong } from "es-hangul";
import { getGames } from "@/lib/games";
import { getAllArchiveDocs } from "@/lib/general";

export default function Search() {
  const t = useTranslations("Common");
  const router = useRouter();
  const pathName = usePathname();

  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  // 검색 대상 게임 캐시
  const [allData, setAllData] = useState<(Game | DocumentArchives)[]>([]);
  const [searchResults, setSearchResults] = useState<
    (Game | DocumentArchives)[]
  >([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, [pathName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function getSearchSubjects() {
      try {
        const subjects: (Game | DocumentArchives)[] = [];

        const games: Game[] = await getGames("released");
        if (!isMounted) return;
        subjects.push(...games);

        const archives: DocumentArchives[] = await getAllArchiveDocs();
        subjects.push(...archives);
        setAllData(subjects);

        setSearchResults(subjects);
      } catch (error: any) {
        console.error("검색 대상을 불러오는 중 오류 발생:", error);
      }
    }

    getSearchSubjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(allData);
      return;
    }

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const hangulCandidate = convertQwertyToHangul(normalizedQuery);
    const chosungCandidate = getChoseong(hangulCandidate || normalizedQuery);

    const filtered = allData.filter((data) => {
      const targets: string[] = [];

      if ("gameTitle" in data) {
        targets.push(
          data.gameTitle,
          data.gameDeveloper ?? "",
          data.gamePublisher ?? "",
        );
      } else {
        targets.push(data.title, data.content);
      }

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
  }, [searchQuery, allData]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      if ("title" in firstResult) {
        // DocumentArchives 인가?
        router.push(`/archives?title=${firstResult.title}`);
      } else {
        // Game 인가?
        router.push(`/games/${firstResult.gameId}`);
      }

      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const searchSummary = useMemo(() => {
    if (!searchQuery.trim()) return "";
    return `${searchResults.length}건의 결과`;
  }, [searchQuery, searchResults]);

  return (
    <>
      {/* 검색 폼 */}
      <div className={"max-w-md mx-auto relative search-container"}>
        <form onSubmit={handleSearch}>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                {searchResults.map((result, idx) =>
                  "title" in result ? (
                    <ArchiveListView key={idx} doc={result} />
                  ) : (
                    <GameListView
                      key={idx}
                      game={result}
                      bIsPublishingMode={false}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t("search-no-results")}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
