import { Button, Flex, Spinner, Text } from "@radix-ui/themes";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import {
  getMembershipApplicationById,
  getMembershipLeaveReqById,
} from "@/lib/permissions";
import type {
  MembershipApplies,
  MembershipLeaves,
  searchParamsPropsSSR,
} from "@/lib/types";
import { getMembershipLeaveReqs } from "@/lib/permissions";
import MembershipApplicationViewer from "@/components/admin/membership-application-viewer";

export default async function AllMembers({
  searchParams,
}: searchParamsPropsSSR) {
  const t = await getTranslations("Admin");

  const { leave, apply, edit } = await searchParams;

  if (leave) {
    const leaveReq = await getMembershipLeaveReqById(
      undefined,
      leave as string,
    );
    return null;
  } else if (apply) {
    const applicationReq = await getMembershipApplicationById(
      undefined,
      apply as string,
    );
    return <MembershipApplicationViewer content={applicationReq} />;
  } else if (edit) {
    return null;
  }

  return null;
}
