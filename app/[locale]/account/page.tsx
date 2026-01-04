"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Checkbox, Button, Flex, Spinner, Text } from "@radix-ui/themes";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "../../../components/ui/card";
import Image from "next/image";
import { Input } from "../../../components/ui/input";
import { useAuth } from "../../../lib/AuthContext";
import { getApiLinkByPurpose } from "../../../lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

import axios from "axios";
import type { AuthResponse, ErrorResponse } from "../../../lib/types";

export default function AccountPage() {
  const t = useTranslations("Authentication");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [bRequestAutoLogin, setAutoLogin] = useState<boolean>(false);
  const [loginFailMessage, setLoginFailMsg] = useState<string>("");
  const { bIsLoggedIn, login, logout, username } = useAuth();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  };

  const handleLogin = async (): Promise<void> => {
    try {
      const response = await axios.post<AuthResponse>(
        getApiLinkByPurpose("auth/login"),
        {
          email: email,
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
        login(response.data.token);
        // localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
      }
      // bSetLoggedInState(true);
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        // error가 AxiosError<ErrorResponse> 타입임이 확인됨
        // 이제 error.response?.data?.message 와 같이 안전하게 접근 가능

        const payload = error.response?.data;
        const errorMessage =
          typeof payload === "string"
            ? payload
            : payload?.message ?? "알 수 없는 에러가 발생했습니다.";
        setLoginFailMsg(t(errorMessage));
        console.error("로그인 실패:", errorMessage);

        // 서버에서 보낸 구체적인 에러 메시지를 alert 등으로 사용자에게 보여줄 수 있습니다.
        // alert(errorMessage);
      } else {
        // Axios 에러가 아닌 다른 종류의 에러 처리 (예: 네트워크 연결 실패 전 요청 설정 오류)
        console.error("예상치 못한 에러가 발생했습니다:", error);
      }
      // bSetLoggedInState(false);
    }
  };

  useEffect(() => {
    // bSetLoggedInState(localStorage.getItem("token") !== "");
  });

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Bitmap ID</h1>
      <p className="text-xl mb-8 max-w-2xl">
        인디 개발자부터 대형 퍼블리셔까지, 최신 게임을 발견하고 다운로드하여
        플레이하세요.
      </p>
      {bIsLoggedIn ? (
        <Card>
          <CardHeader>
            <CardTitle>{username}으로 로그인됨</CardTitle>
          </CardHeader>
          <CardContent>
            <Flex direction="column" gap="2">
              <Button size="3" onClick={logout}>
                {t("logout")}
              </Button>
            </Flex>
          </CardContent>
        </Card>
      ) : (
        <Flex direction="column" gap="4">
          <Card>
            <CardHeader>
              <CardTitle>{t("login")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Flex direction="column" gap="2">
                <Input
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Input
                  placeholder={t("password")}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Text as="label" size="2">
                  <Flex as="span" gap="2">
                    <Checkbox
                      size="1"
                      checked={bRequestAutoLogin}
                      onCheckedChange={(checked) =>
                        setAutoLogin(checked as boolean)
                      }
                    />{" "}
                    {t("keep-login")}
                  </Flex>
                </Text>
                {loginFailMessage !== "" && (
                  <Text color="red" size="3">
                    {loginFailMessage}
                  </Text>
                )}
                <Button size="3" onClick={handleLogin}>
                  {t("login")}
                </Button>
                <Button variant="ghost">
                  <Link href="/account/signup">{t("register")}</Link>
                </Button>
                <Button variant="ghost">
                  <Link href="/account/troubleshoot">
                    {t("troubleshoot-auth")}
                  </Link>
                </Button>
              </Flex>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("other-login-methods")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Flex direction="column" gap="2">
                <Link href={getApiLinkByPurpose("auth/google")}>
                  <Button size="3">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg" />
                    {t("login-google")}
                   </Button>
                </Link>
              </Flex>
            </CardContent>
          </Card>
        </Flex>
      )}
    </div>
  );
}
