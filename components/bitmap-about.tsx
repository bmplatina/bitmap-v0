"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { Flex, Text } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { UAParser } from "ua-parser-js";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function BitmapAbout() {
  const t = useTranslations("Sidebar");
  const bitmapAppTitle = "BITMAP APP";

  const [osName, setOsName] = useState("");

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getOS(); // { name: 'Windows', version: '10' }
    setOsName(`${result.name} ${result.version}`);
    console.log(osName);
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="max-w-md text-center">
        <Flex direction="row" align="center" justify="center" gap="2" mb="4">
          <div className="w-16 h-16">
            <Lottie
              animationData={require("@/public/lottie/BitmapSquare.json")}
              loop={false}
              autoplay={true}
              style={{
                mixBlendMode: "difference",
              }}
            />
          </div>
          {/* <Text
            size="9"
            weight="bold"
            className="whitespace-nowrap animate-bounce"
          >
            BITMAP APP
          </Text> */}
          <motion.div className="flex">
            {" "}
            {/* 글자들을 가로로 배치하기 위해 flex 추가 */}
            {bitmapAppTitle.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }} // 20px 아래에서 투명하게 시작
                animate={{ opacity: 1, y: 0 }} // 제자리로 올라오며 선명해짐
                transition={{
                  delay: 1 + i * 0.075, // 1초 대기 후 0.1초 간격으로 시작
                  duration: 0.4, // 나타나는 데 걸리는 시간
                  ease: "easeOut", // 부드럽게 감속하며 도착
                }}
              >
                <Text
                  as="span"
                  size="9"
                  weight="bold"
                  className="whitespace-nowrap"
                >
                  {char === " " ? "\u00A0" : char}{" "}
                  {/* 공백이 사라지지 않게 처리 */}
                </Text>
              </motion.span>
            ))}
          </motion.div>
        </Flex>

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
      {/* <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} // 한 번만 실행하고 싶을 때
        transition={{ duration: 0.5 }}
      >
        <Text>스크롤하면 나타나는 제목</Text>
      </motion.div> */}
    </div>
  );
}
