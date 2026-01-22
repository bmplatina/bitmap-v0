"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkIsLoggedIn } from "./auth"; // 위에서 만든 함수
import { useRouter } from "@/i18n/routing";
import axios from "axios";
import { getApiLinkByPurpose } from "./utils";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  bIsLoggedIn: boolean;
  login: (token: string) => Promise<void>; // 반환 타입을 Promise<void>로 변경
  logout: () => void;
  username: string;
  uid: string;
  email: string;
  bIsDeveloper: boolean;
  bIsTeammate: boolean;
  bIsEmailVerified: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// 편하게 쓰기 위한 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [bIsLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bIsDeveloper, setIsDeveloper] = useState(false);
  const [bIsTeammate, setIsTeammate] = useState(false);
  const [bIsEmailVerified, setIsEmailVerified] = useState(true);
  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async (token: string) => {
    if (!token) return;

    try {
      const res = await axios.get(getApiLinkByPurpose("auth/profile"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("User fetched:", res.data); // 데이터 확인용 로그
      setUsername(res.data.username);
      setEmail(res.data.email);
      setIsDeveloper(res.data.isDeveloper);
      setIsTeammate(res.data.isTeammate);
      // 백엔드 응답 필드명이 isEmailVerified 또는 is_verified일 수 있으므로 둘 다 확인
      // API 응답에 없으면 토큰에서 직접 디코딩하여 확인 (강력한 대비책)
      let verified = res.data.isEmailVerified ?? res.data.is_verified;
      console.log("Email verified status from API:", verified);
      if (verified === undefined) {
        try {
          const decoded: any = jwtDecode(token);
          verified = decoded.isEmailVerified;
          setUid(decoded.uid);
          console.log("JWT 수동 디코딩: ", verified);
        } catch (e) {
          console.error("토큰 디코딩 실패:", e);
        }
      }
      setIsEmailVerified(!!verified);
    } catch (error) {
      console.error("유저 정보 불러오기 실패", error);
    }
  };

  // 1. 앱이 켜지자마자 로그인 상태 체크
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await fetchUser(token);
      }
      setIsLoggedIn(checkIsLoggedIn());
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // 2. 로그인 함수 (로그인 성공 시 실행)
  const login = async (token: string) => {
    // async 키워드 추가
    localStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
    await fetchUser(token); // 유저 정보를 다 가져올 때까지 기다림
    router.push("/");
  };

  // 3. 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    router.push("/"); // 로그아웃 후 이동
    // window.location.reload(); // 필요하다면 새로고침으로 상태 초기화
  };

  return (
    <AuthContext.Provider
      value={{
        bIsLoggedIn,
        login,
        logout,
        username,
        uid,
        email,
        bIsDeveloper,
        bIsTeammate,
        bIsEmailVerified,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
