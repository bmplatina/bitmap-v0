import { Flex, Text } from "@radix-ui/themes";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { motion, Variants } from "framer-motion";
import BitmapAppDownloadButton from "@/components/common/bitmap-app/bitmap-app-dl-btn";
import BitmapAppAnim from "@/components/common/bitmap-app/bitmap-app-anim";
import BitmapAppRedirector from "@/components/common/bitmap-app/bitmap-app-redirector";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BitmapAbout({ searchParams }: PageProps) {
  const t = await getTranslations("Sidebar");

  // 1. Promise를 resolve 합니다.
  const { gameId, projectId, lectureId } = await searchParams;

  // 2. 비즈니스 로직 수행 (예: DB 호출)
  // const data = await getProducts(category as string);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="max-w-md text-center">
        <BitmapAppAnim />

        <p className="text-sm text-muted-foreground">
          Bitmap App은 예술과 기술을 넘나드는 창작자들과 정보를 공유하고, 그들이
          제작한 게임을 플레이하는 최고의 공간입니다.
        </p>
        <BitmapAppDownloadButton />
        <BitmapAppRedirector gameId={gameId as string} />
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
