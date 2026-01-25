import { getEula, getLocalizedString } from "@/lib/utils";
import type { searchParamsPropsSSR } from "@/lib/types";
import { getLocale, getTranslations } from "next-intl/server";
import SmartMarkdown from "@/components/common/markdown/markdown-renderer";
import { Text } from "@radix-ui/themes";

export default async function EulaPage({ searchParams }: searchParamsPropsSSR) {
  const locale = await getLocale();
  const t = await getTranslations("Common");
  const { license } = await searchParams;
  const eula = await getEula(license as string);

  return (
    <div className="px-4 pt-6">
      {eula ? (
        <SmartMarkdown content={getLocalizedString(locale, eula)} />
      ) : (
        <Text className="text-center">{t("data-not-processable")}</Text>
      )}
    </div>
  );
}
