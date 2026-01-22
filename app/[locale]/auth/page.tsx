"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Checkbox, Button, Flex, Spinner, Text } from "@radix-ui/themes";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TextField } from "@radix-ui/themes";
import { useAuth } from "@/lib/AuthContext";
import { getApiLinkByPurpose, login as loginPost } from "@/lib/utils";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function AccountPage() {
  const t = useTranslations("Authentication");
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [bRequestAutoLogin, setAutoLogin] = useState<boolean>(false);
  const [bIsRequestingLogin, setIsRequestingLogin] = useState<boolean>(false);
  const [loginFailMessage, setLoginFailMsg] = useState<string>("");
  const { bIsLoggedIn, login } = useAuth();

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
      if (bIsLoggedIn) {
        router.push("/");
      }
    },
    [bIsLoggedIn],
  );

  if (bIsLoggedIn) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-6 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-6">Bitmap ID</h1>
        <Text as="p" size="5" className="mb-8 max-w-2xl">
          {t("bitmap-id-desc")}
        </Text>

        <Flex direction="column" gap="4" className="w-full max-w-md">
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

          <Card>
            <CardHeader>
              <CardTitle>{t("other-login-methods")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Flex direction="column" gap="2">
                <Button size="3" asChild>
                  <Link href={getApiLinkByPurpose("auth/google")}>
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
      </div>
    </div>
  );
}
