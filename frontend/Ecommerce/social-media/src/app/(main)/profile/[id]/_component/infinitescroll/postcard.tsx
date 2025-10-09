"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToggleLike } from "@/hooks/mutation/likes";
import { useToggleBookmark } from "@/hooks/mutation/bookmarks";
import CommentSection from "./commentsection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Bookmark } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function PostCard({ post }: { post: any }) {
  const { user, isLoaded } = useUser();

  // 🧩 Wait until user data is ready
  if (!isLoaded) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  const likedUserIds = useMemo(
    () => new Set(post.postLikes?.map((like: any) => like.userId) || []),
    [post.postLikes]
  );

  const bookmarkedUserIds = useMemo(
    () => new Set(post.bookmarks?.map((b: any) => b.userId) || []),
    [post.bookmarks]
  );

  const [liked, setLiked] = useState(likedUserIds.has(user?.id));
  const [bookmarked, setBookmarked] = useState(bookmarkedUserIds.has(user?.id));
  const [showComments, setShowComments] = useState(false);

  const toggleLike = useToggleLike();
  const toggleBookmark = useToggleBookmark(user?.id || "");

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    post._count.postLikes += newLiked ? 1 : -1;
    toggleLike.mutate({ postId: post.id, userId: user?.id || "" });
  };

  const handleBookmark = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    toggleBookmark.mutate({ postId: post.id, userId: user?.id || "" });
  };

  return (
    <div className="space-y-2">
      {/* Author info */}
      <div className="flex items-center gap-3 pl-2">
        <Link
          href={`/profile/${user?.id}`}
          className="flex items-center gap-2 hover:underline"
        >
          <Avatar>
            <AvatarImage
              src={user?.imageUrl || "/default-avatar.png"}
              alt={user?.fullName || "User"}
            />
            <AvatarFallback>{user?.firstName?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user?.fullName || "Unknown User"}</span>
        </Link>
      </div>

      {/* Post content */}
      <article className="border rounded-xl p-4 shadow-sm">
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
          <button onClick={handleLike} className="flex items-center gap-1 text-sm">
            <Heart
              className={`transition-all duration-300 ${
                liked ? "fill-red-500 stroke-red-500" : "stroke-gray-400 fill-none"
              }`}
              size={20}
            />
            <span>{post._count?.postLikes ?? 0}</span>
          </button>

          <button onClick={() => setShowComments((s) => !s)} className="text-sm">
            💬 {post._count?.comments ?? 0}
          </button>

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
