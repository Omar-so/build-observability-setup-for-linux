// File: components/InfinitePosts.tsx
"use client";

import React from "react";
import { useInfinitePosts } from "@/hooks/query/infinityloading/posts";
import PostCard from "./postcard";
import InfinityScrollContainer from "@/components/infinityscrollcontainer";

export default function InfinitePosts() {
  const {
    data,
    fetchNextPage,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfinitePosts();
   
  if (isPending) return <p>Loading posts...</p>;
  if (status === "error") {
    console.log(data?.pages);
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
          {page.data.map((post: any) => (
            <PostCard key={post.id} post={post}  />
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>No more posts to load.</p>}
    </InfinityScrollContainer>
  );
}
