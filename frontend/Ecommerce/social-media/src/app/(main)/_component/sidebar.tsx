"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTopHashtags } from "@/hooks/query/hashtag";
import Link from "next/link";
import { Hash } from "lucide-react";

export default function Sidebar() {
  const { data, isLoading, isError } = useTopHashtags();

  return (
    <Card className="w-64 p-4 mt-8 ml-8 rounded-xl shadow-sm border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Hash size={20} className="text-blue-500" />
          Trending Hashtags
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading && (
          <p className="text-gray-500 text-sm mt-2">Loading hashtags...</p>
        )}

        {isError && (
          <p className="text-red-500 text-sm mt-2">
            Failed to load trending hashtags.
          </p>
        )}

        {!isLoading && !isError && (
          <ul className="flex flex-col gap-2 mt-3">
            {data?.data?.length ? (
              data.data.map((tag: { tag: string; count: number }) => (
                <li key={tag.tag}>
                  <Link
                    href={`/search?tag=${tag.tag.replace("#", "")}`}
                    className="flex justify-between items-center px-3 py-2 bg-gray-50 hover:bg-blue-50 rounded-md transition"
                  >
                    <span className="text-gray-800 font-medium">{tag.tag}</span>
                    <span className="text-gray-500 text-sm">{tag.count}</span>
                  </Link>
                </li>
              ))
            ) : (
              <p className="text-gray-500 text-sm mt-2">No hashtags found.</p>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
