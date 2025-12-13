"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { sidebarItems } from "../lib/sidebar-items";
import axios from "axios";

export default function Sidebar() {
  const pathname = usePathname();

  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      /**
       * API 링크 생성
       * @param substring 도메인 뒤 링크
       */
      function getApiLinkByPurpose(substring: string): string {
        const API_DOMAIN: string = "https://api.prodbybitmap.com/";
        return `${API_DOMAIN}${substring}`;
      }

      try {
        const res = await axios.get(getApiLinkByPurpose("profile"), {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰 실어 보내기
          },
        });
        setUsername(res.data.username); // 백엔드에서 받은 이름 저장
      } catch (error) {
        console.error("유저 정보 불러오기 실패", error);
        // 토큰이 만료되었으면 로그아웃 처리 등을 여기서 함
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="w-64 h-full bg-background border-r flex-col hidden md:flex">
      {/* 사이드바 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-4">
        {sidebarItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
