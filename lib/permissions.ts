import axios from "axios";
import type { MembershipApplies, MembershipLeaveRequest } from "@/lib/types";
import { getApiLinkByPurpose } from "./utils";

async function applyMembership(body: MembershipApplies) {
  try {
    const response = await axios.post<MembershipApplies[]>(
      getApiLinkByPurpose(`permissions/members/apply`),
      body,
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

async function leaveMembership(body: MembershipLeaveRequest) {
  try {
    const response = await axios.post<MembershipLeaveRequest[]>(
      getApiLinkByPurpose(`permissions/members/leave`),
      body,
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

/**
 * @todo 인터페이스 안 쓰고 뭔지 알지 내일의 나?
 */
async function switchBitmapDeveloper(body: MembershipLeaveRequest) {
  try {
    const response = await axios.post<MembershipLeaveRequest[]>(
      getApiLinkByPurpose(`permissions/developer/apply`),
      body,
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

export { applyMembership, leaveMembership, switchBitmapDeveloper };
