import { jwtDecode } from "jwt-decode";

const checkIsLoggedIn = () => {
  if (typeof window === "undefined") return false; // 서버 사이드 렌더링 방지

  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    // exp는 초 단위이므로 1000을 곱해 밀리초로 변환 후 현재 시간과 비교
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken"); // 만료됐으면 삭제
      return false;
    }
    return true; // 토큰 있고 만료 안 됨 -> 로그인 상태
  } catch (error) {
    return false; // 토큰 형식이 이상함
  }
};

export { checkIsLoggedIn };
