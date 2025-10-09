import { useMutation } from "@tanstack/react-query";

interface ToggleLikeParams {
  postId: string;
  userId: string;
}

export function useToggleLike() {
  return useMutation({
    mutationFn: async ({ postId, userId }: ToggleLikeParams) => {
      // Fire request to server
      const res = await fetch(`/api/posts/likes?postId=${postId}&userId=${userId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to toggle like");
      return res.json(); // optional, you can ignore the response if not needed
    },

    // No optimistic update
    onMutate: undefined,

    // No rollback or refetch
    onError: undefined,
    onSettled: undefined,
  });
}
