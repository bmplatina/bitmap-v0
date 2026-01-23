"use client";

import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { Flex, Text } from "@radix-ui/themes";
// import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { DotLottiePlayer } from "@dotlottie/react-player";
import "@dotlottie/react-player/dist/index.css";
import { Link } from "@/i18n/routing";

// const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function BitmapAbout() {
  const t = useTranslations("Sidebar");

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="max-w-md text-center">
        <Flex direction="row" align="center" justify="center" gap="2" mb="4">
          <div className="w-16 h-16">
            <DotLottiePlayer src="/BitmapSquare.lottie" autoplay />
          </div>
          <Text size="8" weight="bold" className="whitespace-nowrap">
            BITMAP APP
          </Text>
        </Flex>
        {/* <div style={{ width: 300, height: 300 }}></div> */}
        {/* <Lottie
          animationData={require("@/public/lottie_BitmapBaseIntro.json")}
          loop={false}
          autoplay={true}
        /> */}

        <p className="text-sm text-muted-foreground">
          Bitmap App은 예술과 기술을 넘나드는 창작자들과 정보를 공유하고, 그들이
          제작한 게임을 플레이하는 최고의 공간입니다.
        </p>
        <Button className="w-full" variant="default" asChild>
          <Link
            href="https://github.com/bmplatina/bitmap/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="mr-2 h-4 w-4" />
            <Text>{t("bitmap-app")}</Text>
          </Link>
        </Button>
      </div>
    </div>
  );
}
