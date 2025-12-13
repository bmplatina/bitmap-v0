"use client";

import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. 토큰 처리를 담당하는 별도의 컴포넌트 분리
function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // URL에서 ?token=... 값 가져오기
    const token = searchParams.get("token");

    if (token) {
      // A. 로컬 스토리지에 저장
      localStorage.setItem("accessToken", token);

      // B. URL에서 토큰 제거 (깔끔하게 만들기)
      // replace를 쓰면 뒤로가기 눌렀을 때 로그인 토큰이 있는 URL로 안 돌아감
      router.replace("/");

      // (선택) 로그인 성공 후 대시보드 등으로 이동하려면:
      router.push("/games");
    }
  }, [searchParams, router]);

  return null; // 화면에 아무것도 렌더링하지 않음 (기능만 수행)
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">Bitmap에 오신 것을 환영합니다</h1>
      <p className="text-xl mb-8 max-w-2xl">
        인디 개발자부터 대형 퍼블리셔까지, 최신 게임을 발견하고 다운로드하여
        플레이하세요.
      </p>
      <Button asChild size="4">
        <Link href="/games">게임 둘러보기</Link>
      </Button>
      {/* Suspense로 감싸지 않으면 빌드 시 
        "useSearchParams() causes client-side rendering..." 에러가 날 수 있음 
      */}
      <Suspense fallback={<div>로그인 처리 중...</div>}>
        <TokenHandler />
      </Suspense>
    </div>
  );
}
