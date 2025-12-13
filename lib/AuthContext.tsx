"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkIsLoggedIn } from "./auth"; // 위에서 만든 함수
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType {
  bIsLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  username: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 편하게 쓰기 위한 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

/**
 * API 링크 생성
 * @param substring 도메인 뒤 링크
 */
export function getApiLinkByPurpose(substring: string): string {
  const API_DOMAIN: string = "https://api.prodbybitmap.com/";
  return `${API_DOMAIN}${substring}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [bIsLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  // 1. 앱이 켜지자마자 로그인 상태 체크
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

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
    setIsLoggedIn(checkIsLoggedIn());
  }, []);

  // 2. 로그인 함수 (로그인 성공 시 실행)
  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
  };

  // 3. 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    router.push("/"); // 로그아웃 후 이동
    // window.location.reload(); // 필요하다면 새로고침으로 상태 초기화
  };

  return (
    <AuthContext.Provider value={{ bIsLoggedIn, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
}
