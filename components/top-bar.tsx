"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "./ui/input"

export default function TopBar() {
  // Electron 및 MacOS 환경 감지 변수 (실제 감지 코드는 구현하지 않음)
  const bIsElectron: boolean = false // 예시 값, 실제로는 Electron 감지 로직 필요
  const bIsMacOS: boolean = false // 예시 값, 실제로는 MacOS 감지 로직 필요

  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState("")

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("검색어:", searchQuery)
    // 여기에 검색 로직 구현
  }

  return (
    <div
      className="h-12 bg-background border-b flex items-center px-4 w-full"
      style={{
        WebkitAppRegion: bIsElectron ? "drag" : "none",
      }}
    >
      {/* 사이트 제목 */}
      <h1
        className="font-bold text-xl"
        style={{
          marginLeft: bIsElectron && bIsMacOS ? "75px" : "0",
        }}
      >
        Bitmap
      </h1>

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
        <div className="relative" style={{ WebkitAppRegion: bIsElectron ? "no-drag" : "none" }}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="게임 검색..."
            className="pl-9 h-9 w-full bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* 오른쪽 여백 */}
      <div className="w-[100px]"></div>
    </div>
  )
}
