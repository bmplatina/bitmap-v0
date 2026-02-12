import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // 이것은 일반적으로 '[locale]' 세그먼트에 해당합니다
  let locale = await requestLocale;

  // 유효한 locale이 사용되었는지 확인합니다
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
    onError(error) {
      if (error.code === "MISSING_MESSAGE") {
        // 로그 서비스(예: Sentry)에 전송하거나 개발 콘솔에 기록
        console.warn(`번역 키 누락 발견: ${error.message}`);
      }
    },
    getMessageFallback({ key }) {
      return key; // 원문 키 반환
    },
  };
});
