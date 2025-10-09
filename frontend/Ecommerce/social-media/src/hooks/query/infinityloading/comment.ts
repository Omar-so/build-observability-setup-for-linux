import { useInfiniteQuery } from "@tanstack/react-query";

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/comments/post/${postId}?page=${pageParam}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      return res.json();
    },
    initialPageParam: 1, 
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? undefined;
    },
  });
}
