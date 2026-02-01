import { getLocale, getTranslations } from "next-intl/server";
import { formatDate } from "@/lib/utils";
import { checkAuthor } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Star } from "lucide-react";
import GameRateSubmitter from "./game-rate-submitter";
import { Flex, Text } from "@radix-ui/themes";
import { GameRating } from "@/lib/types";

interface GameRateProp {
  rate: GameRating;
}

export default async function GameRateViewer({ rate }: GameRateProp) {
  const locale = await getLocale();
  const author = await checkAuthor(
    undefined,
    rate.uid,
  );
  return (
    <>
      <Card key={rate.id}>
        <CardHeader>
          <CardTitle>{rate.title}</CardTitle>
          <CardDescription>
            <Text>
              {author?.username} ({formatDate(locale, rate.createdAt)})
            </Text>
            <Flex className="mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i + 1}
                  color="orange"
                  fill={i + 1 <= rate.rating ? "yellow" : "none"}
                />
              ))}
            </Flex>
          </CardDescription>
        </CardHeader>
        <CardContent>{rate.content}</CardContent>
        <CardFooter>
          <GameRateSubmitter
            gameId={rate.gameId}
            bIsEditing={true}
            rates={[rate]}
          />
        </CardFooter>
      </Card>
    </>
  );
}
