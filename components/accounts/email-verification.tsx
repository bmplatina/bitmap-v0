"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/AuthContext";
import { sendVerifyEmail, verifyEmail, login as loginPost } from "@/lib/auth";
import {
  AlertDialog,
  Button,
  Spinner,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTranslations, useLocale } from "next-intl";

interface EmailVerificationDialogProps {
  open: boolean;
}

export default function EmailVerificationDialog({
  open,
}: EmailVerificationDialogProps) {
  const router = useRouter();

  const locale = useLocale();
  const { login, logout, email } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [bIsVerificationMailSending, setIsVerificationMailSending] =
    useState(false);
  const [bIsVerifying, setIsVerifying] = useState(false);
  const [bIsVerificationMailSent, setIsVerificationMailSent] = useState(false);
  const [verificationFailMessage, setVerificationFailMessage] = useState("");
  const t = useTranslations("Authentication");

  async function handleSendVerificationEmail() {
    try {
      setIsVerificationMailSending(true);
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
      console.error(error);
      setVerificationFailMessage(t(error.message));
      setIsVerificationMailSent(false);
    } finally {
      setIsVerificationMailSending(false);
    }
  }

  async function handleVerification() {
    try {
      setIsVerifying(true);
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
    } finally {
      setIsVerifying(false);
    }
  }

  function enableVerifyButton(): boolean {
    return verificationCode.length === 6 && password.length >= 6;
  }

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>
          {t("email-verification-incomplete")}
        </AlertDialog.Title>
        <AlertDialog.Description size="2">
          {t("email-verification-incomplete-desc")}
        </AlertDialog.Description>

        <Flex direction="column" gap="3" mt="3">
          <Flex gap="3" width="100%">
            {/* <TextField.Root
                disabled={!bIsVerificationMailSent}
                style={{ flex: 6 }}
                placeholder={t("verification-code")}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              /> */}
            <InputOTP
              disabled={!bIsVerificationMailSent}
              maxLength={6}
              onComplete={(value) => setVerificationCode(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button style={{ flex: 4 }} onClick={handleSendVerificationEmail}>
              {bIsVerificationMailSending ? (
                <Spinner />
              ) : (
                <Text wrap="pretty">{t("send-verification-email")}</Text>
              )}
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
              disabled={!enableVerifyButton}
              onClick={handleVerification}
            >
              {bIsVerifying ? (
                <Spinner />
              ) : (
                <Text wrap="pretty">{t("verify")}</Text>
              )}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
