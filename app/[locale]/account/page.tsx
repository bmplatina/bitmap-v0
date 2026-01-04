"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import {
  Checkbox,
  Button,
  Flex,
  Spinner,
  Text,
  DataList,
  Code,
} from "@radix-ui/themes";
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
  const {
    bIsLoggedIn,
    login,
    logout,
    username,
    bIsDeveloper,
    bIsTeammate,
    email: emailResponse,
  } = useAuth();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  };

  async function handleLogin() {
    const loginResult = await loginPost(email, password);
    if (loginResult.success) {
      await login(loginResult.token);
    } else {
      setLoginFailMsg(t(loginResult.token));
    }
  }

  useEffect(() => {
    // bSetLoggedInState(localStorage.getItem("token") !== "");
  });

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Bitmap ID</h1>
      <Text as="p" size="5" className="mb-8 max-w-2xl">
        {t("bitmap-id-desc")}
      </Text>
      {bIsLoggedIn ? (
        <Card>
          <CardHeader>
            <CardTitle>Bitmap ID: {username}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataList.Root>
              <DataList.Item>
                <DataList.Label minWidth="88px">{t("id")}</DataList.Label>
                <DataList.Value>{username}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">{t("email")}</DataList.Label>
                <DataList.Value>
                  <Flex align="center" gap="2">
                    <Code variant="ghost">{emailResponse}</Code>
                  </Flex>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">
                  {t("teammate-account")}
                </DataList.Label>
                <DataList.Value>
                  <Text>{bIsTeammate ? t("teammate-account") : "N/A"}</Text>
                </DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth="88px">
                  {t("developer-account")}
                </DataList.Label>
                <DataList.Value>
                  <Text>{bIsDeveloper ? t("developer-account") : "N/A"}</Text>
                </DataList.Value>
              </DataList.Item>
            </DataList.Root>
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
                <Button size="3" asChild>
                  <a href={getApiLinkByPurpose("auth/google")}>
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Google_Favicon_2025.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      style={{ marginRight: "4px" }}
                    />
                    {t("login-google")}
                  </a>
                </Button>
              </Flex>
            </CardContent>
          </Card>
        </Flex>
      )}
    </div>
  );
}
