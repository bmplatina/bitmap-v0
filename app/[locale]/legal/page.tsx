import { getEula, getLocalizedString } from "@/lib/utils";
import { getLocale } from "next-intl/server";
import SmartMarkdown from "@/components/common/markdown/markdown-renderer";

export default async function EulaPage() {
  const locale = await getLocale();
  const eula = await getEula("BitmapEULA");

  return <SmartMarkdown content={getLocalizedString(locale, eula)} />;
}
