import axios from "axios";
import type {
  MembershipApplyRequest,
  MembershipLeaveRequest,
} from "@/lib/types";
import { getApiLinkByPurpose } from "./utils";

async function applyMembership(token: string, body: MembershipApplyRequest) {
  try {
    const response = await axios.post(
      getApiLinkByPurpose(`permissions/members/apply`),
      body,
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("멤버 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 에러 메시지 객체 반환
    return { message: error.message || "server-error" };
  }
}

async function getMembershipApplications(token: string) {
  try {
    const response = await axios.get(
      getApiLinkByPurpose(`permissions/members/apply`),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("멤버 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 에러 메시지 객체 반환
    return { message: error.message || "server-error" };
  }
}

async function getMembershipApplicationById(token: string, id: string) {
  try {
    const response = await axios.get(
      getApiLinkByPurpose(`permissions/members/apply/${id}`),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("멤버 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 에러 메시지 객체 반환
    return { message: error.message || "server-error" };
  }
}

async function leaveMembership(token: string, body: MembershipLeaveRequest) {
  try {
    const response = await axios.post(
      getApiLinkByPurpose(`permissions/members/leave`),
      body,
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("멤버 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 에러 메시지 객체 반환
    return { message: error.message || "server-error" };
  }
}

async function getMembershipLeaveReqs(token: string) {
  try {
    const response = await axios.get(
      getApiLinkByPurpose(`permissions/members/leave`),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("멤버 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 에러 메시지 객체 반환
    return { message: error.message || "server-error" };
  }
}

async function getMembershipLeaveReqById(token: string, id: string) {
  try {
    const response = await axios.get(
      getApiLinkByPurpose(`permissions/members/leave/${id}`),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("멤버 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 에러 메시지 객체 반환
    return { message: error.message || "server-error" };
  }
}

async function switchBitmapDeveloper(token: string) {
  try {
    const response = await axios.post(
      getApiLinkByPurpose(`permissions/developer/apply`),
      {
        timeout: 10000, // 10초 타임아웃
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("멤버 데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 에러 메시지 객체 반환
    return { message: error.message || "server-error" };
  }
}

export { applyMembership, leaveMembership, switchBitmapDeveloper, getMembershipApplications, getMembershipApplicationById, getMembershipLeaveReqs, getMembershipLeaveReqById };
