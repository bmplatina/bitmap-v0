"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Checkbox, Button, Flex, Spinner, Text } from "@radix-ui/themes";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { TextField } from "@radix-ui/themes";
import { useAuth } from "@/lib/AuthContext";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import MultiLineText from "@/components/common/multi-line-text";

export default function AccountEdit() {
  const t = useTranslations("AccountEdit");
  const router = useRouter();

  const { bIsLoggedIn, isLoading, bIsTeammate } =
    useAuth();

  useEffect(
    function () {
      if (!isLoading) {
        if (!bIsLoggedIn) {
          router.push("/auth");
        }
      }
    },
    [isLoading, bIsLoggedIn],
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Flex direction="column" gap="3">
        <Card>
          <CardHeader>
            <CardTitle>{t("bitmap-apply")}</CardTitle>
          </CardHeader>
          <CardContent>
            <MultiLineText>{t("bitmap-apply-desc")}</MultiLineText>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/team/apply">{t("apply")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </Flex>
    </div>
  );
}
