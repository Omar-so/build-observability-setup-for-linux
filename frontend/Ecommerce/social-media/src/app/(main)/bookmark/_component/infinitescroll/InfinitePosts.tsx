"use client";

import React from "react";
import { useBookmarks } from "@/hooks/query/infinityloading/bookmart";
import PostCard from "./postcard";
import InfinityScrollContainer from "@/components/infinityscrollcontainer";
import { useAuth } from "@clerk/nextjs";

export default function InfinitePosts() {
  const { userId } = useAuth();

  const {
    data,
    fetchNextPage,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useBookmarks(userId);

  if (isPending) return <p>Loading posts...</p>;
  if (status === "error") {
    return <p>Error: {(error as Error).message}</p>;
  }

  return (
    <InfinityScrollContainer
      onBottomReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      className="space-y-4"
    >
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.data.map((bookmark: any) => (
            <PostCard
              key={bookmark.post.id}
              post={bookmark.post}
              user={bookmark.user}     // ✅ pass user info
            />
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>No more posts to load.</p>}
    </InfinityScrollContainer>
  );
}
