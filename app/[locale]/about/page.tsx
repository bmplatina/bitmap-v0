"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Avatar,
  Container,
  Button,
  Box,
  Dialog,
  Flex,
  Text,
  Section,
  Spinner,
  Grid,
  ScrollArea,
} from "@radix-ui/themes";
import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { clamp, getYouTubeVideos } from "@/lib/utils";
import { getMembers } from "@/lib/general";
import BitmapAppAnim from "@/components/common/bitmap-app/bitmap-app-anim";
import BitmapLogo from "@/public/bitmaplogo-notext.png";
import { Link } from "@/i18n/routing";
import { Play, Pause } from "lucide-react";
import { BitmapMemberInfo } from "@/lib/types";
import { useAuth } from "@/lib/AuthContext";
import MultiLineText from "@/components/common/multi-line-text";

export default function BitmapAbout() {
  const t = useTranslations("About");
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([]);
  const [youtubeSliceIndex, setYouTubeSliceIndex] = useState<number>(10);

  const [members, setMembers] = useState<BitmapMemberInfo[]>([]);
  const [isMemberPaused, setIsMemberPaused] = useState(false);
  const [isMemberHovered, setIsMemberHovered] = useState(false);

  const { bIsLoggedIn, bIsTeammate, bIsDeveloper, isLoading } = useAuth();

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

  useEffect(() => {
    async function fetchYouTubeVideos() {
      try {
        const videos = await getYouTubeVideos("UCL137ZWChauNFsma6ifhNdA");
        setYoutubeVideos(videos);
      } catch (error) {}
    }
    async function fetchMembers() {
      try {
        const payloads = await getMembers();
        setMembers(payloads);
      } catch (error) {
        console.log(error);
      }
    }
    fetchYouTubeVideos();
    fetchMembers();
  }, []);

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
              <Flex gap="2">
                <Image
                  src={BitmapLogo}
                  alt="Bitmap Production Logo"
                  width={32}
                  className="invert dark:invert-0 object-contain"
                />
                <Text size="8" weight="bold" className="tracking-tighter">
                  Bitmap Production™
                </Text>
              </Flex>
              <MultiLineText
                as="p"
                size="5"
                color="gray"
                className="max-w-[600px] leading-relaxed break-keep"
              >
                {t("bitmap-overview-desc")}
              </MultiLineText>
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
              <Box className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-4 h-64 flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/OdzY7CqBWVw`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
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
                  <Text size="7" mb="3" weight="bold">
                    What is Bitmap?
                  </Text>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Text
                    as="p"
                    size="3"
                    color="gray"
                    className="leading-relaxed"
                  >
                    {t("what-is-bitmap")}
                  </Text>
                </motion.div>
              </motion.div>
            </Flex>
          </Grid>
        </Section>

        {/* Section 3: Portfolio Grid */}
        <Section size="3">
          <Grid columns={{ initial: "1", md: "2" }} gap="9" width="auto">
            <Flex
              direction="column"
              justify="center"
              gap="5"
              className="order-2 md:order-1"
            >
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Text size="7" mb="3" weight="bold">
                    Our Portfolio
                  </Text>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Text
                    as="p"
                    size="3"
                    color="gray"
                    className="leading-relaxed"
                  >
                    {t("our-portfolio")}
                  </Text>
                </motion.div>
              </motion.div>
            </Flex>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="min-w-0 order-1 md:order-2"
            >
              <Box className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-4 border border-gray-200 dark:border-gray-800">
                <ScrollArea
                  type="always"
                  scrollbars="horizontal"
                  className="w-full"
                >
                  <div className="flex gap-4 pb-4 snap-x">
                    {/* 2. overflow-x-auto와 scrollbar-hide 제거 (ScrollArea가 스크롤을 담당하므로 중복 금지) */}
                    {youtubeVideos.length > 0 ? (
                      <>
                        {youtubeVideos
                          .slice(0, youtubeSliceIndex)
                          .map((video) => (
                            <div
                              key={video}
                              className="flex-none w-[85vw] md:w-[300px] aspect-video bg-black rounded-lg overflow-hidden snap-center shadow-md"
                            >
                              <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${video}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ))}
                        {youtubeSliceIndex < youtubeVideos.length && (
                          <button
                            className="flex-none w-[85vw] md:w-[300px] aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center snap-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border border-dashed border-gray-300 dark:border-gray-700"
                            onClick={() =>
                              setYouTubeSliceIndex(
                                clamp(
                                  youtubeSliceIndex + 10,
                                  0,
                                  youtubeVideos.length,
                                ),
                              )
                            }
                          >
                            <Flex direction="column" align="center" gap="1">
                              <Text size="4" weight="bold">
                                {t("more")}
                              </Text>
                              <Text size="2" color="gray">
                                +{youtubeVideos.length - youtubeSliceIndex}
                              </Text>
                            </Flex>
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        className="flex-none w-[85vw] md:w-[300px] aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center snap-center shadow-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors border border-dashed border-gray-300 dark:border-gray-700"
                        disabled
                      >
                        <Spinner />
                      </button>
                    )}
                  </div>
                </ScrollArea>
              </Box>
            </motion.div>
          </Grid>
        </Section>

        {/* Section 5: Our Members */}
        <Section size="3" className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-12 text-center bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <Flex direction="column" align="center" gap="6">
              <Flex align="center" gap="3">
                <Text size="8" weight="bold">
                  Our Members
                </Text>
                <Button
                  variant="soft"
                  size="1"
                  color="gray"
                  onClick={() => setIsMemberPaused(!isMemberPaused)}
                  className="cursor-pointer"
                >
                  {isMemberPaused ? <Play size={16} /> : <Pause size={16} />}
                </Button>
              </Flex>

              <style>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}</style>

              <Box className="w-full overflow-hidden">
                <motion.div
                  className="flex gap-12 w-max"
                  style={{
                    animation: "marquee 30s linear infinite",
                    animationPlayState:
                      isMemberPaused || isMemberHovered ? "paused" : "running",
                  }}
                  onMouseEnter={() => setIsMemberHovered(true)}
                  onMouseLeave={() => setIsMemberHovered(false)}
                >
                  {[...members, ...members, ...members, ...members].map(
                    (member, index) => (
                      <Flex
                        key={index}
                        direction="column"
                        align="center"
                        gap="1"
                        className="flex-none min-w-[150px]"
                      >
                        <Avatar
                          src={member.avatarUrl}
                          fallback="P"
                          radius="full"
                          size="6"
                          asChild
                        >
                          <Link
                            href={`https://www.youtube.com/${member.channelId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        </Avatar>
                        <Text size="4" weight="bold">
                          {member.name}
                        </Text>
                        <Text size="2" color="gray">
                          {member.position}
                        </Text>
                      </Flex>
                    ),
                  )}
                </motion.div>
              </Box>
            </Flex>
          </motion.div>
        </Section>

        {/* Section 6: Call to Action */}
        <Section size="3" className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-12 text-center bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
          >
            <Flex direction="column" align="center" gap="4">
              <Text size="8" weight="bold">
                Ready to Start?
              </Text>
              <Text size="4" color="gray" className="mb-4">
                {t("start-with-bitmap")}
              </Text>
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  {bIsLoggedIn ? (
                    <Flex direction="column" gap="2">
                      {!bIsTeammate && (
                        <Button asChild>
                          <Link href="/team/apply">Apply to Bitmap</Link>
                        </Button>
                      )}
                      {!bIsDeveloper && (
                        <Button asChild>
                          <Link href="/account/edit">Bitmap Developer</Link>
                        </Button>
                      )}
                    </Flex>
                  ) : (
                    <Flex direction="column" gap="2">
                      <Button asChild>
                        <Link href="/auth">Signin or Signup</Link>
                      </Button>
                    </Flex>
                  )}
                </>
              )}
              <Button asChild>
                <Link href="/">Get Started</Link>
              </Button>
            </Flex>
          </motion.div>
        </Section>
      </Container>
      <footer className="w-full mt-20 py-16 px-4 md:px-6 bg-muted/30 border-t border-border/50">
        <Container size="4">
          <Box asChild px="4">
            <ul style={{ listStyleType: "disc" }}>
              <li>
                <Text size="2" color="gray">
                  {t("start-of-bitmap")}
                </Text>
              </li>
              <li>
                <Text size="2" color="gray">
                  {t("origin-of-name")}
                </Text>
              </li>
              <li>
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Link href="#">
                      <Text size="2" color="blue">
                        Open Source Notices
                      </Text>
                    </Link>
                  </Dialog.Trigger>

                  <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Open Source Notices</Dialog.Title>

                    <Flex direction="column" gap="3">
                      <Text size="3" mb="1" weight="bold">
                        Bitmap Production™ Website
                      </Text>
                      <Box asChild px="4">
                        <ul style={{ listStyleType: "disc" }}>
                          <li>
                            <Text size="2">Frontend: Next.js (React)</Text>
                          </li>
                          <li>
                            <Text size="2">Scripting: TypeScript</Text>
                          </li>
                          <li>
                            <Text size="2">Styling: Tailwind, PostCSS</Text>
                          </li>
                          <li>
                            <Text size="2">Themes: Radix UI</Text>
                          </li>
                          <li>
                            <Text size="2">Icons: Lucide</Text>
                          </li>
                          <li>
                            <Text size="2">API Communication: Axios</Text>
                          </li>
                          <li>
                            <Text size="2">
                              Markdown: Monaco Editor, react-markdown
                            </Text>
                          </li>
                          <li>
                            <Text size="2">Animation: Framer Motion</Text>
                          </li>
                        </ul>
                      </Box>
                      <Text>
                        Visit{" "}
                        <Link
                          href="https://github.com/bmplatina/bitmap-v0"
                          target="_blank"
                        >
                          <Text color="blue">GitHub</Text>
                        </Link>{" "}
                        to see all dependencies.
                      </Text>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button variant="soft" color="gray">
                          Close
                        </Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
              </li>
            </ul>
          </Box>
        </Container>
      </footer>
    </div>
  );
}
