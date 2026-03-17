"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, Table, Text, Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image, { StaticImageData } from "next/image";
import { UAParser } from "ua-parser-js";
import { getBitmapAppFromGitHub } from "@/lib/general";
import type { GitHubRelease } from "@/lib/types";
import { pretendard } from "@/lib/utils";
import WindowsLogo from "@/public/platforms/platformWindows10.png";
import MacLogo from "@/public/platforms/platformMac.png";
import ClientMarkdown from "../markdown/client-markdown";

enum OS {
  Windows = "Windows",
  Mac = "macOS",
  Android = "Android",
  iOS = "iOS",
  Linux = "Linux",
}

export default function BitmapAppDownloadButton() {
  const t = useTranslations("BitmapApp");

  const [gitHubReleases, setGitHubReleases] = useState<GitHubRelease[]>([]);
  const [os, setOS] = useState<OS>(OS.Windows);
  const [latestReleaseDownloadURI, setLatestReleaseDownloadURI] = useState("");
  const [latestReleaseVersion, setLatestReleaseVersion] = useState("");

  useEffect(() => {
    async function fetchBitmapApp() {
      const payload = await getBitmapAppFromGitHub();
      if (payload) setGitHubReleases(payload);
    }
    const parser = new UAParser();
    const result = parser.getOS();
    const name = result.name || "Unknown OS";
    const version = result.version || "";
    const fullOs = `${name} ${version}`.trim();

    fetchBitmapApp();

    switch (name) {
      case "Windows":
        setOS(OS.Windows);
        break;
      case "macOS":
      case "Macintosh":
      case "Mac OS":
        setOS(OS.Mac);
        break;
      case "Android":
        setOS(OS.Android);
        break;
      case "iPadOS":
      case "iOS":
        setOS(OS.iOS);
        break;
      default:
        setOS(OS.Linux);
        break;
    }
  }, []);

  useEffect(
    function () {
      if (gitHubReleases.length > 0) {
        setLatestReleaseDownloadURI(
          gitHubReleases[0].assets.find((asset) =>
            asset.browser_download_url.includes(
              os === OS.Windows ? ".exe" : os === OS.Mac ? ".dmg" : ".exe",
            ),
          )?.browser_download_url ?? "",
        );
        setLatestReleaseVersion(gitHubReleases[0].tag_name);
      }
    },
    [os, gitHubReleases],
  );

  return (
    <Flex direction="column" gap="3" className="w-full">
      {os === OS.Windows || os === OS.Mac ? (
        <DownloadButton uri={latestReleaseDownloadURI} os={os} />
      ) : (
        <Text color="gray" size="2">
          {t("unsupported", { osName: os })}
        </Text>
      )}
      <Dialog.Root>
        <Dialog.Trigger className={pretendard.className}>
          <Button size="1" variant="ghost" color="gray">
            {t("all-releases-view")}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content maxWidth="450px" className={pretendard.className}>
          <Dialog.Title>{t("all-releases")}</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {t("all-releases-desc")}
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Version</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Windows</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>macOS</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {gitHubReleases.map((release, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell>
                      {release.tag_name}
                    </Table.RowHeaderCell>
                    <Table.Cell>
                      <Link
                        href={
                          release.assets.find((a) =>
                            a.browser_download_url.includes(".exe"),
                          )?.browser_download_url ?? ""
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={WindowsLogo}
                          height={20}
                          alt="OS Logo"
                          className="mr-2"
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        href={
                          release.assets.find((a) =>
                            a.browser_download_url.includes(".dmg"),
                          )?.browser_download_url ?? ""
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={MacLogo}
                          height={20}
                          alt="OS Logo"
                          className="mr-2"
                        />
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button>
                <Text className={pretendard.className}>{t("dismiss")}</Text>
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root>
        <Dialog.Trigger className={pretendard.className}>
          <Button size="1" variant="ghost" color="gray">
            Version {latestReleaseVersion}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content maxWidth="450px" className={pretendard.className}>
          <Dialog.Title>
            <Text className={pretendard.className}>
              Version {latestReleaseVersion}
            </Text>
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {t("latest-release-note-desc")}
          </Dialog.Description>

          <Flex direction="column" gap="3">
            {gitHubReleases[0]?.body && (
              <ClientMarkdown content={gitHubReleases[0].body} />
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button>
                <Text className={pretendard.className}>{t("dismiss")}</Text>
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}

interface DownloadButtonProp {
  uri: string;
  os: OS;
}

function DownloadButton({ uri, os }: DownloadButtonProp) {
  const t = useTranslations("Sidebar");

  const [systemIcon, setSystemIcon] = useState<StaticImageData>(WindowsLogo);

  useEffect(
    function () {
      if (os === OS.Windows) setSystemIcon(WindowsLogo);
      else if (os === OS.Mac) setSystemIcon(MacLogo);
    },
    [os],
  );

  return (
    <Button size="3" variant="solid" className="w-full cursor-pointer" asChild>
      <Link href={uri} target="_blank" rel="noopener noreferrer">
        <Image
          src={systemIcon}
          height={20}
          alt="OS Logo"
          className="mr-2"
          style={{
            filter: "brightness(0) invert(0.9)", // 검은색을 강제로 흰색(#ffffff)으로 변경
          }}
        />
        <Text weight="bold">{t("bitmap-app")}</Text>
      </Link>
    </Button>
  );
}
