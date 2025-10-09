"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToggleLike } from "@/hooks/mutation/likes";
import { useToggleBookmark } from "@/hooks/mutation/bookmarks";
import CommentSection from "./commentsection";
import { useAuth } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bookmark } from "lucide-react";

export default function PostCard({ post, user }: { post: any; user: any }) {
  const { userId } = useAuth();

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(true); //  Always true for bookmark page
  const [showComments, setShowComments] = useState(false);

  const toggleLike = useToggleLike();
  const toggleBookmark = useToggleBookmark(userId || "");

  useEffect(() => {
    console.log("Post data:", user);
    if (post?.postLikes && Array.isArray(post.postLikes)) {
      const userHasLiked = post.postLikes.some(
        (like: any) => like.userId === userId
      );
      setLiked(userHasLiked);
    }
  }, [post, userId]);

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);

    post._count.postLikes = (post._count.postLikes || 0) + (newLiked ? 1 : -1);

    toggleLike.mutate({ postId: post.id, userId: userId || "" });
  };

  const handleBookmark = () => {
    toggleBookmark.mutate({ postId: post.id, userId: userId || "" });
    setBookmarked(!bookmarked);
  };

  return (
    <div className="space-y-2">
      {/* Author info */}
      <div className="flex items-center gap-3 pl-2">
        <Link
          href={`/profile/${user?.id || ""}`}
          className="flex items-center gap-2 hover:underline"
        >
          <Avatar>
            <AvatarImage
              src={user?.image || "/default-avatar.png"}
              alt={user?.name || "User"}
            />
            <AvatarFallback>{user?.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user?.name || "Unknown User"}</span>
        </Link>
      </div>

      {/* Post content */}
      <article className="border rounded-xl p-4 shadow-sm bg-white">
        <h2 className="font-semibold text-lg">{post.title}</h2>
        <p className="text-sm text-gray-700 mt-1">{post.content}</p>

        {post.image && (
          <div className="mt-3">
            <Image
              src={post.image}
              alt={post.title}
              width={600}
              height={300}
              className="rounded-md w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-3">
          {/* Like */}
          <button onClick={handleLike} className="flex items-center gap-1 text-sm">
            <Heart
              className={`transition-all duration-300 ${
                liked
                  ? "fill-red-500 stroke-red-500"
                  : "stroke-gray-400 fill-none"
              }`}
              size={20}
            />
            <span>{post._count?.postLikes ?? 0}</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments((s) => !s)}
            className="text-sm"
          >
            💬 {post._count?.comments ?? 0}
          </button>

          {/* Bookmark */}
          <button onClick={handleBookmark} className="text-sm">
            <Bookmark
              className={`transition-all duration-300 ${
                bookmarked
                  ? "fill-yellow-500 stroke-yellow-500"
                  : "stroke-gray-400 fill-none"
              }`}
              size={20}
            />
          </button>
        </div>

        {showComments && <CommentSection postId={post.id} />}
      </article>
    </div>
  );
}
