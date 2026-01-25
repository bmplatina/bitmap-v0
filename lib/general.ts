import axios from "axios";
import type { BitmapMemberInfo } from "@/lib/types";
import { getApiLinkByPurpose } from "./utils";

async function getMembers(): Promise<BitmapMemberInfo[]> {
  try {
    const response = await axios.get<BitmapMemberInfo[]>(
      getApiLinkByPurpose("general/members"),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("멤버 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 빈 배열 반환 (또는 fallback 데이터 사용 가능)
    return [];
  }
}

export { getMembers };
