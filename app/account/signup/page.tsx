"use client";

import { useState, useEffect } from "react";
import { Checkbox, Button, Flex, Spinner, Text } from "@radix-ui/themes";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

import axios from "axios";
import type { AuthResponse, ErrorResponse } from "../../../lib/types";
import { useAuth } from "../../../lib/AuthContext";
import { getApiLinkByPurpose } from "../../../lib/utils";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { bIsLoggedIn } = useAuth();

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await axios.post<AuthResponse>(
        getApiLinkByPurpose("auth/login"),
        {
          username: email,
          password: password,
        },
        {
          timeout: 30000, // 30초 타임아웃
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
      }
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        // error가 AxiosError<ErrorResponse> 타입임이 확인됨
        // 이제 error.response?.data?.message 와 같이 안전하게 접근 가능

        const errorMessage =
          error.response?.data?.message || "알 수 없는 에러가 발생했습니다.";
        console.error("로그인 실패:", errorMessage);

        // 서버에서 보낸 구체적인 에러 메시지를 alert 등으로 사용자에게 보여줄 수 있습니다.
        // alert(errorMessage);
      } else {
        // Axios 에러가 아닌 다른 종류의 에러 처리 (예: 네트워크 연결 실패 전 요청 설정 오류)
        console.error("예상치 못한 에러가 발생했습니다:", error);
      }
    }
  };

  useEffect(() => {
    if (bIsLoggedIn) {
      router.push("/account");
    }
  });

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Bitmap ID 생성</h1>
      <p className="text-xl mb-8 max-w-2xl">
        인디 개발자부터 대형 퍼블리셔까지, 최신 게임을 발견하고 다운로드하여
        플레이하세요.
      </p>
      <Flex direction="column" gap="4">
        <Card>
          <CardHeader>
            <CardTitle>계정이 있으십니까?</CardTitle>
          </CardHeader>
          <CardContent>
            <Flex direction="column" gap="2">
              <Input
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button size="3" onClick={handleLogin}>
                로그인
              </Button>
              <Button variant="ghost">
                <Link href="/account/signup">계정 생성</Link>
              </Button>
              <Button variant="ghost">
                <Link href="/account/troubleshoot">로그인 문제 해결</Link>
              </Button>
            </Flex>
          </CardContent>
        </Card>
      </Flex>
    </div>
  );
}
