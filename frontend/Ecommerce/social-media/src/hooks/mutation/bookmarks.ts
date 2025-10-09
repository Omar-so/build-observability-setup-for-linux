import { useMutation, useQueryClient } from "@tanstack/react-query";

type ToggleBookmarkInput = {
  postId: string;
  userId: string;
};

export function useToggleBookmark(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ToggleBookmarkInput) => {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to toggle bookmark");
      return res.json();
    },

    //  Optimistic Update
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["userBookmarks", userId] });

      const previousData = queryClient.getQueryData(["userBookmarks", userId]);

      queryClient.setQueryData(["userBookmarks", userId], (old: any) => {
        if (!old) return old;
        const isBookmarked = old.pages.some((page: any) =>
          page.data.some((b: any) => b.postId === newData.postId)
        );

        if (isBookmarked) {
          // Remove bookmark
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((b: any) => b.postId !== newData.postId),
            })),
          };
        } else {
          // Add bookmark
          const newBookmark = {
            postId: newData.postId,
            userId: newData.userId,
            createdAt: new Date().toISOString(),
            post: { id: newData.postId, title: "Loading...", content: "", image: null, createdAt: new Date().toISOString() },
          };
          old.pages[0].data.unshift(newBookmark);
          return old;
        }
      });

      return { previousData };
    },

    onError: (err, newData, context) => {
      queryClient.setQueryData(["userBookmarks", userId], context?.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userBookmarks", userId] });
    },
  });
}
