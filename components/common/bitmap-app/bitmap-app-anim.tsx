"use client";

import { Flex, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
import Lottie from "lottie-react";
import BitmapAnim from "@/public/lottie/BitmapSquare.json";

export default function BitmapAppAnim() {
  const t = useTranslations("Sidebar");
  const bitmapAppTitle = "BITMAP APP";

  // Variants를 정의하면 코드가 훨씬 깔끔해집니다.
  const charVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: (i: number) => ({
      opacity: [0, 1, 0, 0.8, 0, 1], // 불투명도가 변하며 깜빡임 유도
      transition: {
        duration: 0.5,
        delay: 1 + Math.random() * 0.5,
        // 무작위성을 더하고 싶다면 Math.random()을 섞을 수도 있습니다.
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    }),
  };

  return (
    <Flex direction="row" align="center" justify="center" gap="2" mb="4">
      <div className="w-16 h-16">
        <Lottie
          animationData={BitmapAnim}
          loop={false}
          autoplay={true}
          className="invert dark:invert-0 object-contain"
        />
      </div>
      <motion.div className="flex" initial="hidden" animate="visible">
        {bitmapAppTitle.split("").map((char, i) => (
          <motion.span
            key={i}
            custom={i} // variants에 인덱스(i)를 전달
            variants={charVariants}
            style={{ display: "inline-block" }} // transform 적용을 위해 필요
          >
            <Text
              as="span"
              size="9"
              weight="bold"
              className="whitespace-nowrap"
            >
              {char === " " ? "\u00A0" : char}
            </Text>
          </motion.span>
        ))}
      </motion.div>
      {/* <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} // 한 번만 실행하고 싶을 때
        transition={{ duration: 0.5 }}
      >
        <Text>스크롤하면 나타나는 제목</Text>
      </motion.div> */}
    </Flex>
  );
}
