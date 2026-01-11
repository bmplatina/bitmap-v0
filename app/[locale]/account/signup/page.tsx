"use client";

import { useState, useEffect } from "react";
import {
  Checkbox,
  Code,
  Button,
  Box,
  Flex,
  Spinner,
  Text,
  DataList,
} from "@radix-ui/themes";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TextField, AlertDialog } from "@radix-ui/themes";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
  getEula,
  signup,
  login as loginPost,
  verifyEmail,
  checkIsEmailDuplicated,
} from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import ClientMarkdown from "@/components/client-markdown";
import { Separator } from "@radix-ui/themes";

export default function Home() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Authentication");
  const t_common = useTranslations("Common");

  // terms 0 -> idpw 1 -> other-info 2 -> register 3
  const [currentView, setCurrentView] = useState<number>(0);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [bIsDeveloper, setIsDeveloper] = useState(false);
  const [bIsTeammate, setIsTeammate] = useState(false);

  const [signupFailMessage, setSignupFailMsg] = useState<string>("");
  const { bIsLoggedIn, login } = useAuth();
  const [eula, setEula] = useState<string>("");
  const [bIsEmailDuplicated, setIsEmailDuplicated] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationFailMessage, setVerificationFailMsg] =
    useState<string>("");

  function validateEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateUsername(): boolean {
    return username.length >= 3 && username.length <= 15;
  }

  function validatePassword(): boolean {
    return password.length >= 8;
  }

  function validatePasswordConfirm(): boolean {
    return passwordConfirm === password;
  }

  function validateUserInfo(setView: boolean): boolean {
    if (
      validateEmail() &&
      validateUsername() &&
      validatePassword() &&
      validatePasswordConfirm() &&
      !bIsEmailDuplicated
    ) {
      if (setView) setCurrentView(2);
      return true;
    }
    return false;
  }

  async function handleSignup() {
    try {
      const signupResult = await signup(
        locale,
        username,
        email,
        password,
        bIsDeveloper,
        bIsTeammate
      );
      console.log("회원가입 성공:", signupResult.username);

      // const loginResult = await loginPost(email, password);

      // if (loginResult.success) {
      //   await login(loginResult.token);
      // } else {
      //   setSignupFailMsg(t(loginResult.token));
      // }

      // router.push("/");
    } catch (error: any) {
      setSignupFailMsg(t(error.message));
      alert(t(error.message)); // "username-exists" 등의 메시지 출력
    }
  }

  async function handleVerification() {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) throw new Error("token-required");
      const verifyResult = await verifyEmail(token, verificationCode);

      if (verifyResult !== "verified") {
        throw Error(verifyResult);
      }

      console.log("인증 성공:", verifyResult);

      const loginResult = await loginPost(email, password, false);

      if (loginResult.success) {
        await login(loginResult.token);
        router.push("/");
      } else {
        setVerificationFailMsg(t(loginResult.token));
      }

      // router.push("/");
    } catch (error: any) {
      setVerificationFailMsg(t(error.message));
      alert(t(error.message)); // "username-exists" 등의 메시지 출력
    }
  }

  async function handleEmailDuplication(): Promise<boolean> {
    try {
      const result: boolean = await checkIsEmailDuplicated(email);
      return result;
    } catch (error: any) {
      console.log(t(error.message));
      return false;
    }
  }

  useEffect(() => {
    if (bIsLoggedIn) {
      router.push("/account");
    }
    getEula("BitmapEULA").then((payload) => {
      console.log(payload);
      setEula(locale === "ko" ? payload.ko : payload.en);
    });
  }, [bIsLoggedIn, locale]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <h1 className="text-4xl font-bold mb-6">Bitmap ID</h1>
        <p className="text-xl mb-8 max-w-2xl">{t("bitmap-id-desc")}</p>
      </div>
      <Box px="4" py="2">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              <Flex gap="3" align="center">
                {currentView == 0 && (
                  <Text weight={currentView == 0 ? "bold" : "light"}>
                    {t("eula")}
                  </Text>
                )}
                {currentView >= 0 && currentView <= 1 && (
                  <Flex align="center" gap="2">
                    {currentView != 1 && <Separator orientation="vertical" />}
                    <Text weight={currentView == 1 ? "bold" : "light"}>
                      {t("general-info")}
                    </Text>
                  </Flex>
                )}
                {currentView >= 1 && currentView <= 2 && (
                  <Flex align="center" gap="2">
                    {currentView != 2 && <Separator orientation="vertical" />}
                    <Text weight={currentView == 2 ? "bold" : "light"}>
                      {t("other-info")}
                    </Text>
                  </Flex>
                )}
                {currentView >= 2 && (
                  <Flex align="center" gap="2">
                    {currentView != 3 && <Separator orientation="vertical" />}
                    <Text weight={currentView == 3 ? "bold" : "light"}>
                      {t("register")}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentView == 0 && (
              <ScrollArea type="always" style={{ height: 300 }}>
                <Box p="2" pr="8">
                  <ScrollBar orientation="horizontal" />
                  <ClientMarkdown content={eula} />
                </Box>
              </ScrollArea>
            )}
            {currentView == 1 && (
              <Flex direction="column" gap="2">
                <Text>{t("email")} *</Text>
                <TextField.Root
                  color={validateEmail() ? undefined : "red"}
                  variant={validateEmail() ? undefined : "soft"}
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={async () => {
                    if (validateEmail()) {
                      const isAvailable = await handleEmailDuplication();
                      // 서버에서 사용 가능(true)을 반환하면 중복이 아님(!isAvailable)
                      setIsEmailDuplicated(isAvailable);
                    }
                  }}
                />
                {!validateEmail() && (
                  <Text as="span" color="red">
                    {t("email-rules")}
                  </Text>
                )}
                {bIsEmailDuplicated && (
                  <Text as="span" color="red">
                    {t("email-duplicate")}
                  </Text>
                )}
                <Text>{t("id")} *</Text>
                <TextField.Root
                  color={validateUsername() ? undefined : "red"}
                  variant={validateUsername() ? undefined : "soft"}
                  placeholder={t("id")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {!validateUsername() && (
                  <Text as="span" color="red">
                    {t("username-rules")}
                  </Text>
                )}
                <Text>{t("password")} *</Text>
                <TextField.Root
                  color={validatePassword() ? undefined : "red"}
                  variant={validatePassword() ? undefined : "soft"}
                  placeholder={t("password")}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField.Root
                  color={validatePasswordConfirm() ? undefined : "red"}
                  variant={validatePasswordConfirm() ? undefined : "soft"}
                  placeholder={`${t("password")} ${t("again")}`}
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                {!validatePassword() && (
                  <Text as="span" color="red">
                    {t("password-rules")}
                  </Text>
                )}
                {!validatePasswordConfirm() && (
                  <Text as="span" color="red">
                    {t("password-mismatch")}
                  </Text>
                )}
              </Flex>
            )}
            {currentView == 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("developer-account")}</CardTitle>
                    <CardDescription>{t("is-developer-desc")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Text as="label" size="3">
                      <Flex as="span" gap="2">
                        <Checkbox
                          id="isDeveloper"
                          checked={bIsDeveloper}
                          onCheckedChange={(checked) =>
                            setIsDeveloper(checked as boolean)
                          }
                        />
                        {t("is-developer")}
                      </Flex>
                    </Text>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("teammate-account")}</CardTitle>
                    <CardDescription>{t("is-teammate-desc")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Text as="label" size="3">
                      <Flex as="span" gap="2">
                        <Checkbox
                          id="isTeammate"
                          checked={bIsTeammate}
                          onCheckedChange={(checked) =>
                            setIsTeammate(checked as boolean)
                          }
                        />
                        {t("is-teammate")}
                      </Flex>
                    </Text>
                  </CardContent>
                </Card>
              </div>
            )}
            {currentView == 3 && (
              <DataList.Root>
                <DataList.Item>
                  <DataList.Label minWidth="88px">{t("id")}</DataList.Label>
                  <DataList.Value>{username}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">{t("email")}</DataList.Label>
                  <DataList.Value>
                    <Flex align="center" gap="2">
                      <Code variant="ghost">{email}</Code>
                    </Flex>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">
                    {t("teammate-account")}
                  </DataList.Label>
                  <DataList.Value>
                    <Text>
                      {bIsTeammate
                        ? t("teammate-account-confirm-true")
                        : t("teammate-account-confirm-false")}
                    </Text>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">
                    {t("developer-account")}
                  </DataList.Label>
                  <DataList.Value>
                    <Text>
                      {bIsDeveloper
                        ? t("developer-account-confirm-true")
                        : t("developer-account-confirm-false")}
                    </Text>
                  </DataList.Value>
                </DataList.Item>
              </DataList.Root>
            )}
          </CardContent>
          <CardFooter>
            {currentView == 0 && (
              <div>
                <Text as="label" size="3">
                  <Flex as="span" gap="2">
                    <Checkbox
                      checked={agreeTerms}
                      onCheckedChange={(checked) =>
                        setAgreeTerms(checked === true)
                      }
                    />
                    {t("agree-terms")} *
                  </Flex>
                </Text>
                <Button
                  disabled={!agreeTerms}
                  onClick={() => setCurrentView(1)}
                  className="mt-2"
                >
                  {t_common("next")}
                </Button>
              </div>
            )}
            {currentView == 1 && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={() => setCurrentView(0)} variant="surface">
                  {t_common("back")}
                </Button>
                <Button
                  onClick={() => validateUserInfo(true)}
                  disabled={!validateUserInfo(false)}
                >
                  {t_common("next")}
                </Button>
              </div>
            )}
            {currentView == 2 && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={() => setCurrentView(1)} variant="surface">
                  {t_common("back")}
                </Button>
                <Button onClick={() => setCurrentView(3)}>
                  {t_common("next")}
                </Button>
              </div>
            )}
            {currentView == 3 && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={() => setCurrentView(2)} variant="surface">
                  {t_common("back")}
                </Button>
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button onClick={handleSignup}>{t("register")}</Button>
                    {/* <Button onClick={handleSignup}>{t("register")}</Button> */}
                  </AlertDialog.Trigger>
                  <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>
                      {t("registering-bitmap-id")}
                    </AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      {t("email-verification")}
                      <TextField.Root
                        placeholder={t("verification-code")}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                      {verificationFailMessage && (
                        <Text color="red" size="2" className="mt-2">
                          {verificationFailMessage}
                        </Text>
                      )}
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="surface" color="gray">
                          {t_common("cancel")}
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button variant="solid" onClick={handleVerification}>
                          {t("verify")}
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </div>
            )}
            {signupFailMessage && (
              <Text color="red" size="2" className="mt-2">
                {signupFailMessage}
              </Text>
            )}
          </CardFooter>
        </Card>
      </Box>
    </div>
  );
}
