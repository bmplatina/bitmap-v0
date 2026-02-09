"use client";

import { useEffect, useState } from "react";
import { ProfileList } from "../accounts/profile";
import { getProfile } from "@/lib/auth";
import { UserProfile } from "@/lib/types";

interface UidProps {
  uid: string;
}

export default function MembershipKickHandler({ uid }: UidProps) {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getProfile(undefined, uid).then((user) => {
      console.log("Queried user:", user);
      setUser(user);
    });
  }, [uid]);

  return (
    <>
      <ProfileList
        username={user?.username || ""}
        email={user?.email || ""}
        bIsAdmin={user?.isAdmin || false}
        bIsDeveloper={user?.isDeveloper || false}
        bIsTeammate={user?.isTeammate || false}
        bIsEmailVerified={user?.isEmailVerified || false}
        avatarUri={user?.avatarUri || ""}
        bUseSample
      />
    </>
  );
}
