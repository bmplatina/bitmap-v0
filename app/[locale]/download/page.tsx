import { Flex, Text, Container } from "@radix-ui/themes";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { motion, Variants } from "framer-motion";
import type { searchParamsPropsSSR } from "@/lib/types";
import BitmapAppDownloadButton from "@/components/common/bitmap-app/bitmap-app-dl-btn";
import BitmapAppAnim from "@/components/common/bitmap-app/bitmap-app-anim";
import BitmapAppRedirector from "@/components/common/bitmap-app/bitmap-app-redirector";

export default async function BitmapAbout({
  searchParams,
}: searchParamsPropsSSR) {
  const t = await getTranslations("Sidebar");

  // 1. Promise를 resolve 합니다.
  const { gameId, projectId, lectureId } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-[85vh] w-full px-4">
      <Container size="1">
        <Flex direction="column" align="center" gap="6" className="text-center">
          {/* 애니메이션 및 타이틀 영역 */}
          <BitmapAppAnim bIsAppText />

          {/* 설명 텍스트 영역 */}
          <Text
            size="3"
            color="gray"
            className="max-w-[420px] leading-relaxed break-keep opacity-90"
          >
            Bitmap App은 예술과 기술을 넘나드는 창작자들과 정보를 공유하고,
            제작된 게임을 플레이하며 소통하는 최적의 공간입니다.
          </Text>

          {/* 버튼 영역 */}
          <Flex
            direction="column"
            gap="4"
            className="w-full max-w-[300px] mt-2"
          >
            <BitmapAppRedirector gameId={gameId as string} />
            <BitmapAppDownloadButton />
            <Text size="1" color="gray" className="opacity-60">
              안전한 설치를 위해 공식 릴리즈 페이지로 이동합니다.
            </Text>
          </Flex>
        </Flex>
      </Container>
    </div>
  );
}
