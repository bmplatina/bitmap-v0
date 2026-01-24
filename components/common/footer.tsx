import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Flex, Separator, Text, Container } from "@radix-ui/themes";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="w-full mt-20 py-16 px-4 md:px-6 bg-muted/30 border-t border-border/50">
      <Container size="4">
        <Flex
          direction={{ initial: "column", md: "row" }}
          gap="6"
          justify="between"
          align={{ initial: "start", md: "center" }}
        >
          <Flex direction="column" gap="2">
            <Text size="3" weight="bold" className="tracking-tighter">
              Bitmap Production
            </Text>
            <Text size="1" color="gray" className="opacity-70">
              {t("copyright-bitmap")}
            </Text>
          </Flex>

          <Flex
            gap="5"
            wrap="wrap"
            align="center"
            className="text-muted-foreground"
          >
            <Link
              href="#"
              className="hover:text-foreground transition-colors duration-200"
            >
              <Text size="2" weight="medium">
                {t("privacy-policy")}
              </Text>
            </Link>
            <Separator orientation="vertical" />
            <Link
              href="/legal/"
              className="hover:text-foreground transition-colors duration-200"
            >
              <Text size="2" weight="medium">
                {t("terms-of-use")}
              </Text>
            </Link>
            <Separator orientation="vertical" />
            <Link
              href="#"
              className="hover:text-foreground transition-colors duration-200"
            >
              <Text size="2" weight="medium">
                {t("legal")}
              </Text>
            </Link>
            <Separator orientation="vertical" />
            <Link
              href="#"
              className="hover:text-foreground transition-colors duration-200"
            >
              <Text size="2" weight="medium">
                {t("site-map")}
              </Text>
            </Link>
          </Flex>
        </Flex>
        <div className="mt-8">
          <Text size="2" as="p" color="gray">
            Bitmap Production | 대표자: 이재혁 | 메일: platina@prodbybitmap.com
            | 호스팅 서비스 제공: Bitmap Production. | 본 서비스는 영리 목적을
            취하지 않으며 법인 및 사업자가 아닌 개인이 관리하고 있습니다.
          </Text>
        </div>
      </Container>
    </footer>
  );
}
