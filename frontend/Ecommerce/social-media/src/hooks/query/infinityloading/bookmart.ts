import { useInfiniteQuery } from "@tanstack/react-query";
import { UserBookmarksResponse } from "@/lib/type";

export function useBookmarks(userId: string) {
  return useInfiniteQuery<UserBookmarksResponse>({
    queryKey: ["userBookmarks", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/bookmark/user_bookmark/${userId}?page=${pageParam}&limit=5`);
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.pagination.currentPage + 1;
      return nextPage <= lastPage.pagination.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
}
