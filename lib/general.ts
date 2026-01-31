import axios from "axios";
import type { MembershipApplies, stringLocalized } from "@/lib/types";
import { getApiLinkByPurpose } from "./utils";

async function getMembers(
  scope: "approved" | "all" | "pending",
): Promise<MembershipApplies[]> {
  try {
    const response = await axios.get<MembershipApplies[]>(
      getApiLinkByPurpose(`general/members/${scope}`),
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

async function getEula(eula: string): Promise<stringLocalized> {
  try {
    const response = await axios.get<stringLocalized>(
      getApiLinkByPurpose(`general/eula/${eula}`),
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data?.ko) {
      return response.data;
    }
    return { ko: "", en: "" };
  } catch (error) {
    console.error("EULA 가져오는 중 오류 발생:", error);
    return { ko: "", en: "" };
  }
}



export { getMembers, getEula };
