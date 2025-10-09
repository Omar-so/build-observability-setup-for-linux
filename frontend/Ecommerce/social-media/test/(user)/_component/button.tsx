"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ClientButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.refresh()}>
        listen
    </Button>
  );
}
