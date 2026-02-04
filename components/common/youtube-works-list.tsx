"use client";

import { useEffect, useState } from "react";
import { clamp, getYouTubeVideos } from "@/lib/utils";
import { Flex, ScrollArea, Spinner, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

export default function YouTubeWorksList() {
  const t = useTranslations("About");
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([]);
  const [youtubeSliceIndex, setYouTubeSliceIndex] = useState<number>(10);

  useEffect(() => {
    async function fetchYouTubeVideos() {
      try {
        const videos = await getYouTubeVideos("UCL137ZWChauNFsma6ifhNdA");
        setYoutubeVideos(videos);
      } catch (error) {}
    }
    fetchYouTubeVideos();
  }, []);

  return (
    <ScrollArea type="always" scrollbars="horizontal" className="w-full">
      <div className="flex gap-4 pb-4 snap-x">
        {/* 2. overflow-x-auto와 scrollbar-hide 제거 (ScrollArea가 스크롤을 담당하므로 중복 금지) */}
        {youtubeVideos.length > 0 ? (
          <>
            {youtubeVideos.slice(0, youtubeSliceIndex).map((video) => (
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
                    clamp(youtubeSliceIndex + 10, 0, youtubeVideos.length),
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
  );
}
