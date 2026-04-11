import { Flex, Text } from "@radix-ui/themes";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import type { RatingDetails } from "@/lib/types";

interface AgeRatingImageProps {
  ageRating: number;
  ratingContentDescriptors?: RatingDetails[];
}

export default function AgeRatingImage({
  ageRating,
  ratingContentDescriptors,
}: AgeRatingImageProps) {
  const t = useTranslations("GamesView");
  const locale = useLocale();
  const gameInformationComitee: string = locale === "en" ? "pegi" : "grac";

  function getAgeRatingImageUri() {
    let svgName: string = "";

    if (ageRating == 0) svgName = "all.svg";
    else svgName = `${ageRating}.svg`;

    return `/${gameInformationComitee}/${svgName}`;
  }

  function getRatingDetailsImageUri(contentDescriptors: RatingDetails) {
    const extension = locale === "en" ? "jpg" : "svg";
    return `/${gameInformationComitee}/${contentDescriptors}.${extension}`;
  }

  const svgPath = getAgeRatingImageUri();

  return (
    // <Flex gap="2" justify="center" align="center">
    //   <Text>심의 등급: </Text>
    //   <Image src={svgPath} alt="GRAC game rating" width="50" height="50" />
    // </Flex>
    <Card className="mt-6 space-y-4">
      <CardContent className="mt-6">
        <Flex direction="column" gap="2">
          <Image src={svgPath} alt="GRAC game rating" width="50" height="50" />

          {ratingContentDescriptors && (
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
          )}
          <Text>{t("agerating")}</Text>
        </Flex>
      </CardContent>
    </Card>
  );
}
