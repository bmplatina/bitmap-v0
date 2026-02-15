import { getArchiveDocument } from "@/lib/general";
import { formatDate } from "@/lib/utils";
import type { searchParamsPropsSSR } from "@/lib/types";
import { getLocale, getTranslations } from "next-intl/server";
import SmartMarkdown from "@/components/common/markdown/markdown-renderer";
import { Flex, Text } from "@radix-ui/themes";
import { Separator } from "@/components/ui/separator";

export default async function ArchivedDocumentPage({
  searchParams,
}: searchParamsPropsSSR) {
  const locale = await getLocale();
  const t = await getTranslations("Common");
  const { title } = await searchParams;
  const document = await getArchiveDocument(title as string);

  if (!title) {
    return (
      <div className="px-4 md:px-32 pt-6 items-center justify-center">
        <Text className="text-center">{t("data-not-processable")}</Text>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-32 pt-6">
      <Flex direction="column" gap="4">
        <Text size="8" weight="bold">
          {document.title}
        </Text>
        <Text weight="bold">
          Last Updated: {formatDate(locale, document.lastUpdatedAt)}
        </Text>
        <Separator />
        <SmartMarkdown content={document.content} />
      </Flex>
    </div>
  );
}
