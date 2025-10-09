import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCommentInput, CommentType } from "@/lib/type";


// i will pass data of user here to show name and image of user who commented in optimistic update
export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: CreateCommentInput) => {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const data = await res.json();
      return data.data as CommentType;
    },

    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      const previousData = queryClient.getQueryData<any>(["comments", postId]);

      const optimisticComment: CommentType = {
        id: Math.random().toString(36).substring(2, 9),
        content: newComment.content,
        createdAt: new Date().toISOString(),
        author: {
          id: newComment.authorId,
          name: "You",
          email: null,
          image: null,
        },
      };

      queryClient.setQueryData(["comments", postId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, index: number) =>
            index === 0
              ? { ...page, data: [optimisticComment, ...page.data] }
              : page
          ),
        };
      });

      return { previousData };
    },

    onError: (_err, _newComment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["comments", postId], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}



export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to update comment");
      return res.json();
    },

    //  Optimistic Update
    onMutate: async (updatedComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousData = queryClient.getQueryData<any>(["comments"]);

      // Optimistically update the comment content
      queryClient.setQueryData(["comments"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((comment: any) =>
              comment.id === updatedComment.id
                ? { ...comment, content: updatedComment.content }
                : comment
            ),
          })),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      // Rollback on failure
      if (context?.previousData) {
        queryClient.setQueryData(["comments"], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete comment");
      return id;
    },

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousData = queryClient.getQueryData<any>(["comments"]);

      queryClient.setQueryData(["comments"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((comment: any) => comment.id !== deletedId),
          })),
        };
      });

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["comments"], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
