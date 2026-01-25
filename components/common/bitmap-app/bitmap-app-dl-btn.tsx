"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { UAParser } from "ua-parser-js";

export default function BitmapAppDownloadButton() {
  const t = useTranslations("Sidebar");

  const [osName, setOsName] = useState("");

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getOS(); // { name: 'Windows', version: '10' }
    setOsName(`${result.name} ${result.version}`);
    console.log(osName);
  }, []);

  return (
    <Button className="w-full" asChild>
      <Link
        href="https://github.com/bmplatina/bitmap/releases"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download className="mr-2 h-4 w-4" />
        <Text>{t("bitmap-app")}</Text>
      </Link>
    </Button>
  );
}
