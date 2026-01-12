import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { Game } from "@/lib/types";
import { AspectRatio } from "@radix-ui/themes";

interface GameProp {
  game: Game;
  disabled: boolean;
}

export default function GameRedirectButton({ game, disabled }: GameProp) {
  return (
    <>
      <Link
        key={game.gameId}
        href={disabled ? "#" : `/games/${game.gameId}`}
        className="flex-none w-[85vw] md:w-[300px] aspect-video relative rounded-lg overflow-hidden shadow-md group"
      >
        <AspectRatio ratio={16 / 9}>
          <Image
            src={
              game.gameImageURL[1] ||
              game.gameImageURL[0] ||
              "/placeholder.svg?height=400&width=283"
            }
            alt={game.gameTitle}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
          {/* 하단 텍스트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4 text-left">
            <h3 className="text-white text-2xl font-bold leading-tight">
              {game.gameTitle}
            </h3>
            <p className="text-white/80 text-sm font-medium">
              {game.gameDeveloper}
            </p>
          </div>
        </AspectRatio>
      </Link>
    </>
  );
}
