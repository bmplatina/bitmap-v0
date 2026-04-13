"use client";

import { CheckboxCards, Flex, RadioCards, Text } from "@radix-ui/themes";
import { Card, CardContent } from "../ui/card";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import type { RatingDetails } from "@/lib/types";

type AgeRating = 0 | 12 | 15 | 19;

interface AgeRatingImageProps {
  ageRating: number;
  ratingContentDescriptors?: RatingDetails[];
  bEditorMode?: boolean;
  setAgeRatingCallback?: (newRating: number) => null;
  setRatingContentDescriptorsCallback?: (newDescriptors: string[]) => null;
}

export default function AgeRatingImage({
  ageRating,
  ratingContentDescriptors,
  bEditorMode,
  setAgeRatingCallback,
  setRatingContentDescriptorsCallback,
}: AgeRatingImageProps) {
  const t = useTranslations("GamesView");
  const t_GameSubmit = useTranslations("GameSubmit")
  const locale = useLocale();
  const gameInformationComitee: string = locale === "en" ? "pegi" : "grac";

  function getAgeRatingImageUri(age: number) {
    let svgName: string = "";

    if (age == 0) svgName = "all.svg";
    else svgName = `${age}.svg`;

    return `/${gameInformationComitee}/${svgName}`;
  }

  function getRatingDetailsImageUri(contentDescriptors: RatingDetails) {
    const extension = locale === "en" ? "jpg" : "svg";
    return `/${gameInformationComitee}/${contentDescriptors}.${extension}`;
  }

  return (
    <Card className="mt-6 space-y-4">
      <CardContent className="mt-6">
        <Flex direction="column" gap="2">
          {bEditorMode ? (
            <RadioCards.Root
              value={ageRating.toString()}
              onValueChange={
                setAgeRatingCallback
                  ? (value) => setAgeRatingCallback(Number(value))
                  : undefined
              }
              columns={{ initial: "1", sm: "4" }}
            >
              {[0, 12, 15, 19].map((tempAgeRating, index) => (
                <RadioCards.Item value={tempAgeRating.toString()} key={index}>
                  <Image
                    src={getAgeRatingImageUri(tempAgeRating)}
                    alt="GRAC game rating"
                    width="50"
                    height="50"
                  />
                </RadioCards.Item>
              ))}
            </RadioCards.Root>
          ) : (
            <Image
              src={getAgeRatingImageUri(ageRating)}
              alt="GRAC game rating"
              width="50"
              height="50"
            />
          )}

          {bEditorMode ? (
            <CheckboxCards.Root
              value={ratingContentDescriptors}
              columns={{ initial: "1", sm: "4" }}
              onValueChange={
                setRatingContentDescriptorsCallback
                  ? (value) => setRatingContentDescriptorsCallback(value)
                  : undefined
              }
            >
              {[
                "crime",
                "drugs",
                "gamble",
                "horror",
                "sex",
                "swear",
                "violence",
              ].map((elem, index) => (
                <CheckboxCards.Item value={elem} key={index}>
                  <Image
                    key={index}
                    src={getRatingDetailsImageUri(elem as RatingDetails)}
                    alt={elem}
                    width="35"
                    height="35"
                  />
                  <Text key={elem}>{t_GameSubmit(elem)}</Text>
                </CheckboxCards.Item>
              ))}
            </CheckboxCards.Root>
          ) : (
            ratingContentDescriptors && (
              <Flex gap="2" align="start">
                {ratingContentDescriptors.map((contentDescriptor, index) => {
                  if (locale === "en" && contentDescriptor === "crime")
                    return null;

                  return (
                    <Image
                      key={index}
                      src={getRatingDetailsImageUri(contentDescriptor)}
                      alt={contentDescriptor}
                      width="35"
                      height="35"
                    />
                  );
                })}
              </Flex>
            )
          )}
          <Text>{t("agerating")}</Text>
        </Flex>
      </CardContent>
    </Card>
  );
}
