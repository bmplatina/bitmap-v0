"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import {
  CheckboxGroup,
  Button,
  Flex,
  Spinner,
  Text,
  TextField,
  TextArea,
  Box,
  Checkbox,
} from "@radix-ui/themes";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getEula } from "@/lib/utils";
import ClientMarkdown from "@/components/common/markdown/client-markdown";
import { Link as LinkIcon, User, Youtube, Building2 } from "lucide-react";
import type { BitmapMemberInfo } from "@/lib/types";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import MultiLineText from "@/components/common/multi-line-text";
import PreventExit from "@/components/common/prevent-exit";

export default function BitmapApply() {
  const t = useTranslations("BitmapDeveloper");
  const router = useRouter();
  const locale = useLocale();

  const { isLoading, bIsDeveloper } = useAuth();
  const [eula, setEula] = useState<string>("");
  const [bIsAgreementRead, setIsAgreementRead] = useState<boolean>(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  useEffect(
    function () {
      if (!isLoading) {
        if (!bIsDeveloper) {
          // ! 떼셈
          router.push("/account/permissions");
        } else {
          getEula("BitmapGameDistributionAgreement").then((payload) => {
            console.log(payload);
            setEula(locale === "ko" ? payload.ko : payload.en);
          });
        }
      }
    },
    [isLoading, bIsDeveloper],
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <PreventExit />

      <Flex direction="column" gap="5">
        <MultiLineText size="7" as="p" weight="bold">
          {t("apply-title")}
        </MultiLineText>
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent>
            <ScrollArea type="always" style={{ height: 300 }}>
              <Box p="2" pr="8">
                <ScrollBar orientation="horizontal" />
                <ClientMarkdown content={eula} />
              </Box>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Text as="label" size="2">
              <Flex gap="2">
                <Checkbox onCheckedChange={(checked) => setIsAgreementRead(checked as boolean)} />
                {t("agreement-checkbox")}
              </Flex>
            </Text>
          </CardFooter>
        </Card>

        <Separator />

        <Button disabled={!bIsAgreementRead}>{t("submit")}</Button>
      </Flex>
    </div>
  );
}
