// /app/(main)/profile/[id]/page.tsx
import React from "react";
import ProfileClient from "./_component/infinitescroll/profileclient";

export default function Home({ params }: { params: { id: string } }) {
  return <ProfileClient id={params.id} />;
}
