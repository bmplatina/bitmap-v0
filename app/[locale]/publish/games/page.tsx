"use client";

import { createContext, useState, useEffect, Suspense } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Edit,
  Loader2,
  Clock,
  User,
  Tag,
  Globe,
  Monitor,
  Code,
} from "lucide-react";
import { cn, getLocalizedString } from "@/lib/utils";
import type { Game, stringLocalized } from "@/lib/types";
import MarkdownEditor from "@/components/markdown-editor";
import { toast } from "@/hooks/use-toast";
import {
  renderMarkdown,
  getGames,
  getPendingGames,
  submitGame,
  uploadGameImage,
} from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import { GamePublishEditor } from "@/components/game-publish-editor";
import { Badge, Box, Button, Tabs, Text, Flex, Quote } from "@radix-ui/themes";
import Image from "next/image";
import {} from "lucide-react";
import { GamePublishProvider } from "@/lib/GamePublishContext";

export default function SubmitGames() {
  const t = useTranslations("GameSubmit");
  return (
    <GamePublishProvider>
      <Tabs.Root defaultValue="store-viewed-info">
        <Tabs.List>
          <Tabs.Trigger value="store-viewed-info">
            {t("store-viewed-info")}
          </Tabs.Trigger>
          <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="store-viewed-info">
            <GamePublishEditor />
          </Tabs.Content>

          <Tabs.Content value="documents">
            <Text size="2">Access and update your documents.</Text>
          </Tabs.Content>

          <Tabs.Content value="settings">
            <Text size="2">
              Edit your profile or update contact information.
            </Text>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </GamePublishProvider>
  );
}
