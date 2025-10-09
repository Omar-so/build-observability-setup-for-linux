"use client";
// hooks/usePostMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";



export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: any) => {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!res.ok) throw new Error("Failed to create post");
      return res.json();
    },

    // Optimistic update
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prevData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        const optimistic = {
          id: "temp-" + Math.random(),
          ...newPost,
          createdAt: new Date().toISOString(),
        };
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: [optimistic, ...old.pages[0].data],
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData) queryClient.setQueryData(["posts"], ctx.prevData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: { id: string; title?: string; content?: string }) => {
      const res = await fetch(`/api/post`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error("Failed to update post");
      return res.json();
    },

    onMutate: async (updated) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prevData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) =>
              p.id === updated.id ? { ...p, ...updated } : p
            ),
          })),
        };
      });

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData) queryClient.setQueryData(["posts"], ctx.prevData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(`/api/post?post-id=${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      return postId;
    },

    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const prevData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.filter((p: any) => p.id !== postId),
          })),
        };
      });

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevData) queryClient.setQueryData(["posts"], ctx.prevData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
