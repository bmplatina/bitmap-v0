"use client";

import * as React from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { getNotifications } from "@/lib/notifications";
import type { Notification } from "@/lib/types";
import { Spinner, Popover, Flex, Text } from "@radix-ui/themes";
import { Link } from "@/i18n/routing";

const sampleData: Notification[] = [
  {
    id: 0, // BIGINT -> number (2^53-1 이상은 string으로 처리하기도 함)
    uid: "string", // 수신 대상 사용자 ID
    type: "GAME_UPDATE", // 알림 유형 (문자열 리터럴로 상세 정의 추천)
    title: "제목임", // 알림 제목
    content: "내용임", // 알림 상세 내용
    redirectionUri: "/games/4", // 클릭 시 이동 경로 (NULL 허용이므로 옵셔널)
    isRead: true, // 읽음 여부
    readAt: "string", // 읽은 시간 (ISO string 또는 null)
    createdAt: "string", // 생성 시간
  },
];

interface NotificationCenterProps {
  children?: React.ReactNode;
  // open?: boolean;
  // setOpen?: (open: boolean) => void;
}

export default function NotificationCenter({
  children,
}: NotificationCenterProps) {
  const bIsMobile = useIsMobile();
  return (
    <>
      {bIsMobile ? (
        children
      ) : (
        <Popover.Root>
          <Popover.Trigger>{children}</Popover.Trigger>
          <Popover.Content minWidth="400px">
            <NotificationListCollection />
          </Popover.Content>
        </Popover.Root>
      )}
    </>
  );
}

function NotificationListCollection() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [bIsFetching, setIsFetching] = React.useState(true);

  React.useEffect(() => {
    async function fetchNotifications() {
      const token = localStorage.getItem("accessToken") || "";
      try {
        setIsFetching(true);
        const data = await getNotifications(token, "unread");
        setNotifications(data || sampleData);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsFetching(false);
      }
    }

    fetchNotifications();
  }, []);

  return (
    <Flex direction="column">
      {bIsFetching ? (
        <Flex justify="center" py="4">
          <Spinner />
        </Flex>
      ) : (
        notifications.map((content, index) => (
          <NotificationListView key={index} content={content} />
        ))
      )}
    </Flex>
  );
}

interface NotificationListViewProp {
  content: Notification;
}

function NotificationListView({ content }: NotificationListViewProp) {
  return (
    <Link
      href={content.redirectionUri || "#"}
      className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors w-full"
    >
      {/*<div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-muted">
        <Image
          src={content.redirectionUri || "/placeholder.svg?height=40&width=40"}
          alt={content.title}
          fill
          className="object-cover"
        />
      </div>*/}
      <div className="flex-1 min-w-0">
        <Text
          as="p"
          size="2"
          weight={content.isRead ? "regular" : "bold"}
          truncate
          color={content.isRead ? "gray" : undefined}
        >
          {content.title}
        </Text>
        <Text as="p" size="1" color="gray" truncate>
          {content.content}
        </Text>
      </div>
    </Link>
  );
}
