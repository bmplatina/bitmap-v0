import type { Game } from "../lib/types"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Tag } from "lucide-react"

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  // 출시일 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
      <div className="relative aspect-[1/1.414] w-full">
        <Image
          src={game.gameImageURL || "/placeholder.svg?height=400&width=283"}
          alt={game.gameTitle}
          fill
          className="object-cover"
          priority
        />
        {game.isEarlyAccess === 1 && <Badge className="absolute top-2 right-2 bg-amber-500">얼리 액세스</Badge>}
      </div>
      <CardContent className="flex-1 p-4">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{game.gameTitle}</h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{game.gameDeveloper}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{game.gameGenre}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(game.gameReleasedDate)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/games/${game.gameId}`}>상세 보기</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
