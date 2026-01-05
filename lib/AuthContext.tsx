"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { checkIsLoggedIn } from "./auth"; // 위에서 만든 함수
import { useRouter } from "next/navigation";
import axios from "axios";
import { getApiLinkByPurpose } from "./utils";

interface AuthContextType {
  bIsLoggedIn: boolean;
  login: (token: string) => Promise<void>; // 반환 타입을 Promise<void>로 변경
  logout: () => void;
  username: string;
  email: string;
  bIsDeveloper: boolean;
  bIsTeammate: boolean;
  bIsEmailVerified: boolean;
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
  const [bIsEmailVerified, setIsEmailVerified] = useState(false);
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
      setIsEmailVerified(res.data.isEmailVerified);
    } catch (error) {
      console.error("유저 정보 불러오기 실패", error);
    }
  };

  // 1. 앱이 켜지자마자 로그인 상태 체크
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      fetchUser(localStorage.getItem("accessToken") as string);
    }

    setIsLoggedIn(checkIsLoggedIn());
  }, []);

  // 2. 로그인 함수 (로그인 성공 시 실행)
  const login = async (token: string) => {
    // async 키워드 추가
    localStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
    await fetchUser(token); // 유저 정보를 다 가져올 때까지 기다림
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
        email,
        bIsDeveloper,
        bIsTeammate,
        bIsEmailVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
