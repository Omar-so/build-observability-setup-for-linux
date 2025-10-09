// hooks/useInfinitePosts.ts
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/posts?page=${pageParam}&limit=5`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      return data; 
        },
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => {
      const { current_page, total_pages } = lastPage.metadata;
      return current_page < total_pages ? current_page + 1 : undefined;
    }
  });
}
