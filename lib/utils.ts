import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * API 링크 생성
 * @param substring 도메인 뒤 링크
 */
function getApiLinkByPurpose(substring: string): string {
  const API_DOMAIN: string = "https://api.prodbybitmap.com/";
  return `${API_DOMAIN}${substring}`;
}

export { cn, getApiLinkByPurpose };
