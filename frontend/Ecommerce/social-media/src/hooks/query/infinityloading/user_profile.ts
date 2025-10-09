import { useInfiniteQuery } from "@tanstack/react-query";

interface FetchParams {
  userId: string;
  pageParam?: number;
}

const fetchUserProfile = async ({ userId, pageParam = 1 }: FetchParams) => {
  const res = await fetch(`/api/posts/user_profile/${userId}?page=${pageParam}&limit=5`);
  if (!res.ok) throw new Error("Failed to fetch user posts");
  return res.json();
};

export function useUserPosts(userId: string) {
  return useInfiniteQuery({
    queryKey: ["userPosts", userId],
    queryFn: ({ pageParam }) => fetchUserProfile({ userId, pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined,
    initialPageParam: 1,
  });
}
