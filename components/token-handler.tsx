"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { sendVerifyEmail, verifyEmail, login as loginPost } from "@/lib/utils";
import { AlertDialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

export function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, logout, bIsEmailVerified, bIsLoggedIn, email } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [verificationFailMessage, setVerificationFailMessage] = useState("");
  const t = useTranslations("Authentication");

  async function handleSendVerificationEmail() {
    try {
      const response = await sendVerifyEmail(email);
      if (response !== "email-sent") {
        throw Error(response);
      }
      console.log("로그인 이메일 인증 번호 발송 성공");
      setVerificationFailMessage(t(response));
    } catch (error: any) {
      setVerificationFailMessage(t(error.message));
    }
  }

  async function handleVerification() {
    try {
      const verifyResult = await verifyEmail(email, verificationCode);
      if (verifyResult !== "verified") {
        throw Error(verifyResult);
      }

      console.log("인증 성공:", verifyResult);

      const loginResult = await loginPost(email, password);

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
        {/* ||를 &&로 교체하셈 */}
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>
            {t("email-verification-incomplete")}
          </AlertDialog.Title>
          <AlertDialog.Description size="2">
            <Text>{t("email-verification-incomplete-desc")}</Text>
            <Flex gap="3" width="100%">
              <TextField.Root
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
              className="mt-2"
              placeholder={t("password")}
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {verificationFailMessage && (
              <Text color="red" size="2" className="mt-2">
                {verificationFailMessage}
              </Text>
            )}
          </AlertDialog.Description>
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
