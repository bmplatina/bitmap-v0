"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { sendVerifyEmail, verifyEmail, login as loginPost } from "@/lib/utils";
import { AlertDialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { useTranslations, useLocale } from "next-intl";

export function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const { login, logout, bIsEmailVerified, bIsLoggedIn, email } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [bIsVerificationMailSent, setIsVerificationMailSent] = useState(false);
  const [verificationFailMessage, setVerificationFailMessage] = useState("");
  const t = useTranslations("Authentication");

  async function handleSendVerificationEmail() {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) throw new Error("token-required");
      const response = await sendVerifyEmail(locale, token);
      if (response !== "email-sent") {
        throw Error(response);
      }
      console.log("로그인 이메일 인증 번호 발송 성공");
      setVerificationFailMessage(t(response));
      setIsVerificationMailSent(true);
    } catch (error: any) {
      setVerificationFailMessage(t(error.message));
      setIsVerificationMailSent(false);
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
        setVerificationFailMessage(t(loginResult.token));
      }

      // router.push("/");
    } catch (error: any) {
      setVerificationFailMessage(t(error.message));
      alert(t(error.message)); // "username-exists" 등의 메시지 출력
    }
  }

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      login(token);
      router.replace("/");
    }
  }, [searchParams, router, login]);

  return (
    <div>
      <AlertDialog.Root open={!bIsEmailVerified && bIsLoggedIn}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>
            {t("email-verification-incomplete")}
          </AlertDialog.Title>
          <AlertDialog.Description size="2">
            {t("email-verification-incomplete-desc")}
          </AlertDialog.Description>

          <Flex direction="column" gap="3" mt="3">
            <Flex gap="3" width="100%">
              <TextField.Root
                disabled={!bIsVerificationMailSent}
                style={{ flex: 6 }}
                placeholder={t("verification-code")}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button style={{ flex: 4 }} onClick={handleSendVerificationEmail}>
                {t("send-verification-email")}
              </Button>
            </Flex>
            <TextField.Root
              placeholder={t("password")}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {verificationFailMessage && (
              <Text color="red" size="2">
                {verificationFailMessage}
              </Text>
            )}
          </Flex>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Action>
              <Button variant="surface" color="gray" onClick={logout}>
                {t("logout")}
              </Button>
            </AlertDialog.Action>
            <AlertDialog.Action>
              <Button
                variant="solid"
                disabled={verificationCode.length !== 6}
                onClick={handleVerification}
              >
                {t("verify")}
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}
