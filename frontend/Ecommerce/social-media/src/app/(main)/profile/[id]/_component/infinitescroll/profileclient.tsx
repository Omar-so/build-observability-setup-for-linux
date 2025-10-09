// /app/(main)/profile/[id]/_component/ProfileClient.tsx
"use client";

import React from "react";
import { useUserDataQuery } from "@/hooks/query/userdata";
import HomePage from "./HomePage";
import Image from "next/image";

export default function ProfileClient({ id }: { id: string }) {
  const { data, isLoading, error } = useUserDataQuery(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Failed to load profile 😢
      </div>
    );

  const user = data?.user;

  return (
    <div className="flex justify-center items-start min-h-screen p-6">
      <div className="flex flex-col items-center w-full max-w-2xl space-y-6">
        {/* 🧑‍💼 Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4">
            <Image
              src={user?.image || "/default-avatar.png"}
              alt={user?.name || "User Avatar"}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">{user?.name}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="flex gap-6 mt-3 text-gray-700">
            <span>Followers: {user?._count.followers}</span>
            <span>Posts: {user?._count.posts}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Joined {new Date(user?.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* 🧩 Posts Section */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Posts</h2>
          <HomePage userId={id}  />
        </div>
      </div>
    </div>
  );
}
