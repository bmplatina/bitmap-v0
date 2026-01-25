"use client";

import {
  Container,
  Flex,
  Heading,
  Text,
  Section,
  Grid,
  Box,
} from "@radix-ui/themes";
import { motion, Variants } from "framer-motion";
import BitmapAppAnim from "@/components/common/bitmap-app/bitmap-app-anim";

export default function BitmapAbout() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="w-full">
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <BitmapAppAnim bIsAppText={false} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <Text size="2" color="gray" className="mt-8 opacity-60">
            Scroll down to explore
          </Text>
        </motion.div>
      </div>

      <Container size="3" className="px-4">
        {/* Section 1: Intro Text */}
        <Section size="3">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <Flex
              direction="column"
              align="center"
              gap="5"
              className="text-center"
            >
              <Heading size="8" weight="bold" className="tracking-tighter">
                Bitmap Production
              </Heading>
              <Text
                as="p"
                size="5"
                color="gray"
                className="max-w-[600px] leading-relaxed break-keep"
              >
                우리는 기술과 예술의 경계에서 새로운 가치를 만들어냅니다.
                <br />
                창작자들의 상상을 현실로 만드는 여정에 함께하세요.
              </Text>
            </Flex>
          </motion.div>
        </Section>

        {/* Section 2: Features Grid */}
        <Section size="3">
          <Grid columns={{ initial: "1", md: "2" }} gap="9" width="auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Box className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-8 h-64 flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <Text
                  size="6"
                  weight="bold"
                  color="gray"
                  className="opacity-30"
                >
                  Creative Space
                </Text>
              </Box>
            </motion.div>

            <Flex direction="column" justify="center" gap="5">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Heading size="7" mb="3">
                    Our Vision
                  </Heading>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Text
                    as="p"
                    size="3"
                    color="gray"
                    className="leading-relaxed"
                  >
                    Bitmap Production은 모든 사람이 자신만의 이야기를 게임으로
                    표현할 수 있는 세상을 꿈꿉니다. 강력한 도구와 열정적인
                    커뮤니티를 통해 여러분의 잠재력을 깨워보세요.
                  </Text>
                </motion.div>
              </motion.div>
            </Flex>
          </Grid>
        </Section>

        {/* Section 3: Call to Action */}
        <Section size="3" className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-12 text-center bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
          >
            <Flex direction="column" align="center" gap="4">
              <Heading size="8">Ready to Start?</Heading>
              <Text size="4" color="gray" className="mb-4">
                지금 바로 Bitmap과 함께 새로운 창작을 시작해보세요.
              </Text>
            </Flex>
          </motion.div>
        </Section>
      </Container>
    </div>
  );
}
