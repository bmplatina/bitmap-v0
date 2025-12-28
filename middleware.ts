import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // matcher에서 api-proxy를 제외해야 SSR 통신 시 경로 변조를 막을 수 있습니다.
  matcher: [
    '/', 
    '/(ko|en)/:path*',
    // 아래 패턴은 api-proxy, _next 등을 제외한 모든 경로에 미들웨어를 적용합니다.
    '/((?!api-proxy|_next|.*\\..*).*)'
  ]
};
