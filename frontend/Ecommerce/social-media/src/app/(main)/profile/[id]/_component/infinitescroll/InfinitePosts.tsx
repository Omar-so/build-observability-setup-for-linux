"use client";

import React from "react";
import { useUserPosts } from "@/hooks/query/infinityloading/user_profile";
import PostCard from "./postcard";
import InfinityScrollContainer from "@/components/infinityscrollcontainer";

export default function InfinitePosts({ userId }: { userId: string }) {
  const {
    data,
    fetchNextPage,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useUserPosts(userId);

  if (isPending) return <p>Loading posts...</p>;

  if (status === "error") {
    console.error(error);
    return <p>Error: {(error as Error).message}</p>;
  }
return (
  <InfinityScrollContainer
    onBottomReached={() => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    }}
    className="space-y-4"
  >
    {data?.pages.map((page, pageIndex) => (
      <React.Fragment key={pageIndex}>
        {page.posts.map((post: any) => (
          <PostCard key={post.id} post={post} />
        ))}
      </React.Fragment>
    ))}

    {isFetchingNextPage && <p>Loading more...</p>}
    {!hasNextPage && <p>No more posts to load.</p>}
  </InfinityScrollContainer>
);

}
