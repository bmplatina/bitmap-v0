"use client";

import { useState, useEffect } from "react";
import { Checkbox, Button, Box, Flex, Spinner, Text } from "@radix-ui/themes";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../../../components/ui/card";
import { ScrollArea, ScrollBar } from "../../../../components/ui/scroll-area";
import { Input } from "../../../../components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getEula } from "../../../../lib/utils";
import { useAuth } from "../../../../lib/AuthContext";
import ClientMarkdown from "../../../../components/client-markdown";

export default function Home() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Authentication");
  const t_common = useTranslations("Common");

  const [currentView, setCurrentView] = useState("terms");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { bIsLoggedIn } = useAuth();
  const [eula, setEula] = useState<string>("");

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
        <p className="text-xl mb-8 max-w-2xl">
          인디 개발자부터 대형 퍼블리셔까지, 최신 게임을 발견하고 다운로드하여
          플레이하세요.
        </p>
      </div>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          {currentView === "terms" ? t("eula") : t("register")}
        </CardHeader>
        <CardContent>
          {currentView === "terms" ? (
            <ScrollArea type="always" style={{ height: 300 }}>
              <Box p="2" pr="8">
                <ScrollBar orientation="horizontal" />
                <ClientMarkdown content={eula} />
              </Box>
            </ScrollArea>
          ) : (
            <Flex direction="column" gap="2">
              <Text>{`${t("email")}, ${t("id")}`}</Text>
              <Input
                placeholder={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder={t("id")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Text>{t("password")}</Text>
              <Input
                placeholder={t("password")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder={`${t("password")} ${t("again")}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Flex>
          )}
        </CardContent>
        <CardFooter>
          {currentView === "terms" ? (
            <div>
              <Text as="label" size="3">
                <Flex as="span" gap="2">
                  <Checkbox
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  />
                  {t("agree-terms")}
                </Flex>
              </Text>
              <Button
                disabled={!agreeTerms}
                onClick={() => setCurrentView("idpw")}
              >
                {t_common("accept")}
              </Button>
            </div>
          ) : (
            <div className="flex justify-end space-x-2 pt-4">
              <Button onClick={() => setCurrentView("terms")} variant="surface">
                {t_common("back")}
              </Button>
              <Button>{t("register")}</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
