"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Checkbox, Button, Flex, Spinner, Text } from "@radix-ui/themes";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TextField } from "@radix-ui/themes";
import { useAuth } from "@/lib/AuthContext";
import { getApiLinkByPurpose } from "@/lib/utils";
import { login as loginPost } from "@/lib/auth";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import BitmapLogo from "@/public/bitmaplogo-notext.png";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
  const t = useTranslations("Authentication");
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [bRequestAutoLogin, setAutoLogin] = useState<boolean>(false);
  const [bIsRequestingLogin, setIsRequestingLogin] = useState<boolean>(false);
  const [loginFailMessage, setLoginFailMsg] = useState<string>("");
  const { isLoading, bIsLoggedIn, login } = useAuth();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleLogin();
    }
  };

  async function handleLogin() {
    setIsRequestingLogin(true);
    const loginResult = await loginPost(email, password, bRequestAutoLogin);
    if (loginResult.success) {
      await login(loginResult.token);
    } else {
      setLoginFailMsg(t(loginResult.token));
    }
    setIsRequestingLogin(false);
  }

  useEffect(
    function () {
      if (!isLoading) {
        if (bIsLoggedIn) {
          router.push("/");
        }
      }
    },
    [isLoading, bIsLoggedIn],
  );

  if (bIsLoggedIn) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-250px)] p-4 md:p-6 text-center">
      <Flex
        direction="column"
        gap="4"
        align="center"
        className="w-full max-w-md"
      >
        <Flex gap="2">
          <Image
            src={BitmapLogo}
            alt="Bitmap Logo"
            width={32}
            height={32}
            className="invert dark:invert-0 object-contain"
          />
          <Text size="8" weight="bold">
            Bitmap ID
          </Text>
        </Flex>

        <Text as="p" size="4" color="gray">
          {t("bitmap-id-desc")}
        </Text>

        <Flex direction="column" gap="4" className="w-full">
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
                  {bIsRequestingLogin ? <Spinner /> : <Text>{t("login")}</Text>}
                </Button>

                <Link href="/auth/signup">
                  <Button variant="ghost">{t("register")}</Button>
                </Link>

                <Link href="/auth/troubleshoot">
                  <Button variant="ghost">{t("troubleshoot-auth")}</Button>
                </Link>
              </Flex>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>{t("other-login-methods")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Flex direction="column" gap="2">
                <Button size="3" asChild>
                  <Link href="https://api.prodbybitmap.com/auth/google">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                      alt="Google"
                      width={20}
                      height={20}
                      style={{ marginRight: "4px" }}
                    />
                    {t("login-google")}
                  </Link>
                </Button>
              </Flex>
            </CardContent>
          </Card>
        </Flex>
      </Flex>
    </div>
  );
}
