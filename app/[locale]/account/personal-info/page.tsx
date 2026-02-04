"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { Button, Flex, Spinner, Text, Dialog } from "@radix-ui/themes";
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
import { editUsername, editAvatarUri } from "@/lib/auth";
import { ProfileList } from "@/components/accounts/profile";
import ProfilePicsEditor from "@/components/accounts/profile-pics-editor";

export default function AccountEdit() {
  const t = useTranslations("AccountEdit");
  const router = useRouter();

  const { bIsLoggedIn, isLoading } = useAuth();

  const [bIsAccountEditModalOpened, setIsAccountEditModalOpened] =
    useState<boolean>(false);

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

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Flex direction="column" gap="3">
        <Card>
          <CardHeader>
            <CardTitle>{t("account-edit")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileList />
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsAccountEditModalOpened(true)}>
              {t("edit")}
            </Button>
            <AccountInfoEditor
              bIsOpened={bIsAccountEditModalOpened}
              onOpenChange={setIsAccountEditModalOpened}
            />
          </CardFooter>
        </Card>
      </Flex>
    </div>
  );
}

interface DialogOpenProp {
  bIsOpened?: boolean;
  onOpenChange: (open: boolean) => void;
}

function AccountInfoEditor({
  bIsOpened = false,
  onOpenChange,
}: DialogOpenProp) {
  const t = useTranslations("AccountEdit");
  const { username, avatarUri, isLoading } = useAuth();

  const [newUsername, setNewUsername] = useState(username);
  const [newAvatarUri, setNewAvatarUri] = useState(avatarUri);

  async function postChanges() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const responseAvatarUri = await editAvatarUri(token, newAvatarUri);
      const responseUsername = await editUsername(token, newUsername);
    } catch (error: any) {
    } finally {
    }
  }

  useEffect(
    function () {
      if (!isLoading) setNewAvatarUri(avatarUri);
    },
    [isLoading],
  );

  return (
    <Dialog.Root open={bIsOpened}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{t("account-edit")}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Make changes to your profile.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Username
            </Text>
            <TextField.Root
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={t("username-edit")}
            />
          </label>
          <ProfilePicsEditor username={username} profileUri={setNewAvatarUri} />
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={postChanges}>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
