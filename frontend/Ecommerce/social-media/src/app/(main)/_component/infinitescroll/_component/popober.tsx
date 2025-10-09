"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Trash, UserRoundPen } from "lucide-react";

export default function CommentActionsPopover({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Popover>
      {/* Popover opens when clicking the icon */}
      <PopoverTrigger asChild>
        <button className="p-1 rounded-full hover:bg-gray-200 transition">
          <UserRoundPen className="text-blue-500 hover:text-blue-700" size={20} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col gap-2 p-2 w-32 rounded-md shadow-lg">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-100 text-blue-600 transition"
        >
          <UserRoundPen size={16} /> Edit
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-red-100 text-red-600 transition"
        >
          <Trash size={16} /> Delete
        </button>
      </PopoverContent>
    </Popover>
  );
}
