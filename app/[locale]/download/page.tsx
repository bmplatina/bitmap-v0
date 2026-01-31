import { Suspense } from "react";
import { Flex, Container, Button, Spinner } from "@radix-ui/themes";
import MultiLineText from "@/components/common/multi-line-text";
import { getTranslations } from "next-intl/server";
import type { searchParamsPropsSSR } from "@/lib/types";
import BitmapAppDownloadButton from "@/components/common/bitmap-app/bitmap-app-dl-btn";
import BitmapAppAnim from "@/components/common/bitmap-app/bitmap-app-anim";
import BitmapAppRedirector from "@/components/common/bitmap-app/bitmap-app-redirector";

export default async function BitmapAbout({
  searchParams,
}: searchParamsPropsSSR) {
  const t = await getTranslations("BitmapApp");

  // 1. Promise를 resolve 합니다.
  const { gameId, projectId, lectureId } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-[85vh] w-full px-4">
      <Container size="1">
        <Flex direction="column" align="center" gap="6" className="text-center">
          {/* 애니메이션 및 타이틀 영역 */}
          <BitmapAppAnim bIsAppText />

          {/* 설명 텍스트 영역 */}
          <MultiLineText
            size="3"
            color="gray"
            className="max-w-[420px] leading-relaxed break-keep opacity-90"
          >
            {t("about")}
          </MultiLineText>

          {/* 버튼 영역 */}
          <Flex
            direction="column"
            gap="4"
            className="w-full max-w-[300px] mt-2"
          >
            <Suspense fallback={<RedirectorSkeleton />}>
              <BitmapAppRedirector gameId={gameId as string} />
            </Suspense>
            <BitmapAppDownloadButton />
            <MultiLineText size="1" color="gray" className="opacity-60">
              {t("download-alert")}
            </MultiLineText>
          </Flex>
        </Flex>
      </Container>
    </div>
  );
}

function RedirectorSkeleton() {
  return (
    <Button variant="outline" className="w-full cursor-pointer" disabled>
      <Spinner />
    </Button>
  );
}
