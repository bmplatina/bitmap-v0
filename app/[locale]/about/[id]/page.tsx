"use client";

import { use } from "react";
import { Link } from "@/i18n/routing";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";
import BitmapAbout from "@/components/bitmap-about";

export default function RedirectAppPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  useEffect(() => {
    window.location.href = `bitmap://games/${id}`;
  }, [id]);

  return (
    <div className="p-6 w-full">
      <h1 className="text-3xl font-bold mb-6">Open in Bitmap App</h1>
      <Button className="w-full" variant="default" asChild>
        <Link href={`bitmap://games/${params.id}`}>
          <Monitor className="mr-2 h-4 w-4" />
          Bitmap App에서 {params.id} 보기
        </Link>
      </Button>
      <BitmapAbout />
    </div>
  );
}
