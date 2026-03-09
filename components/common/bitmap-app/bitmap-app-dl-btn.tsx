"use client";

import { useEffect, useState } from "react";
import { Button, Dialog, Table, Text, Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image, { StaticImageData } from "next/image";
import { UAParser } from "ua-parser-js";
import { getBitmapAppFromGitHub } from "@/lib/general";
import type { GitHubRelease } from "@/lib/types";
import WindowsLogo from "@/public/platforms/platformWindows10.png";
import MacLogo from "@/public/platforms/platformMac.png";
import { release } from "os";

enum OS {
  Windows = "Windows",
  Mac = "Mac",
  Android = "Android",
  iOS = "iOS",
  Linux = "Linux",
}

export default function BitmapAppDownloadButton() {
  const t = useTranslations("Sidebar");

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

    console.log("OS Detection Result:", os);
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
      {os === OS.Windows ? (
        <DownloadButton uri={latestReleaseDownloadURI} os={os} />
      ) : (
        <p>현재 기기에서는 다운로드를 지원하지 않습니다.</p>
      )}
      <Dialog.Root>
        <Dialog.Trigger>
          <Button size="1" variant="ghost" color="gray">
            모든 릴리스 보기
          </Button>
        </Dialog.Trigger>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>모든 릴리스</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Bitmap 앱의 모든 릴리스를 아래에서 확인하고 다운로드할 수 있습니다.
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
                {gitHubReleases.map((release) => (
                  <Table.Row>
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
              <Button>Dismiss</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Text color="gray" size="1">
        Version {latestReleaseVersion}
      </Text>
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
