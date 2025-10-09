"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useComments } from "@/hooks/query/infinityloading/comment";
import { useAddComment, useUpdateComment, useDeleteComment } from "@/hooks/mutation/comment";
import { useAuth } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentActionsPopover from './_component/popober'
import {formatTimeAgo } from '@/lib/formatter'
export default function CommentSection({ postId }: { postId: string }) {
  const { userId } = useAuth();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(postId);
  const addComment = useAddComment(postId);
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    addComment.mutate({ postId, content: text, authorId: userId || "" });
    setText("");
  };

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Write a comment..."
        />
        <button onClick={handleAdd} className="px-3 py-1 bg-blue-600 text-white rounded">
          Comment
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {data?.pages?.map((page: any, pi: number) => (
          <React.Fragment key={pi}>
            {page.data.map((comment: any) => (
         <div key={comment.id} className="flex flex-col gap-1 border-b pb-2">
         {/* Author info */}
         <div className="flex items-center gap-2">
           <Link
             href={`/user/${comment.author?.id || ""}`}
             className="flex items-center gap-2 hover:underline"
           >
             <Avatar className="w-8 h-8">
               <AvatarImage
                 src={comment.author?.image || "/default-avatar.png"}
                 alt={comment.author?.name || "User"}
               />
               <AvatarFallback>{comment.author?.name?.[0] ?? "U"}</AvatarFallback>
             </Avatar>
             <span className="font-medium text-sm">{comment.author?.name || "Unknown User"}</span>
           </Link>
       
           {/* Actions popover */}
           {comment.author?.id === userId && (
             <CommentActionsPopover
               onEdit={() => {
                 const newText = prompt("Edit comment", comment.content);
                 if (newText != null) updateComment.mutate({ id: comment.id, content: newText });
               }}
               onDelete={() => deleteComment.mutate(comment.id)}
             />
           )}
         </div>
       
         {/* Comment content */}
         <div className="ml-10">
           <div className="text-sm text-gray-700 break-words">{comment.content}</div>
           <div className="text-xs text-gray-400 mt-1">{formatTimeAgo(comment.createdAt)}</div>
         </div>
       </div>
       
         
          
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-3 text-center">
        {hasNextPage ? (
         <button
         onClick={() => fetchNextPage()}
         className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
       >
         Load more comments
       </button>
       
        ) : (
          <div className="text-sm text-gray-500">No more comments</div>
        )}
      </div>
    </div>
  );
}
