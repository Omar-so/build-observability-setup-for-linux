"use client";

import InfinitePosts from "./InfinitePosts";

export default function HomePage({ userId }: { userId: string }) {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">profile</h1>
      <InfinitePosts userId={userId} />
    </main>
  );
}