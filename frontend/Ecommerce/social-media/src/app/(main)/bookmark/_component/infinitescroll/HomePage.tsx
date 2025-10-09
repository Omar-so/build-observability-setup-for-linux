"use client";

import InfinitePosts from "./InfinitePosts";

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
      <InfinitePosts />
    </main>
  );
}