"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Checkbox, Button, Flex, Spinner, Text } from "@radix-ui/themes";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TextField } from "@radix-ui/themes";
import { useAuth } from "@/lib/AuthContext";
import { getApiLinkByPurpose, login as loginPost } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

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

  function handleLogin() {
    loginPost(email, password).then((payload) => {
      if (payload.success) {
        login(payload.token);
      } else {
        setLoginFailMsg(t(payload.token));
      }
    });
  }

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
                <TextField.Root
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <TextField.Root
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

                <Link href="/account/signup">
                  <Button variant="ghost">{t("register")}</Button>
                </Link>

                <Link href="/account/troubleshoot">
                  <Button variant="ghost">{t("troubleshoot-auth")}</Button>
                </Link>
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
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      style={{ marginRight: "4px" }}
                    />
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
