import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 Promise here
) {
  const { id } = await params; // await it first

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const skip = (page - 1) * limit;

  const userInfo = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: {
        select: { followers: true, posts: true },
      },
    },
  });

  if (!userInfo) {
    return Response.json({ status: 404, message: "User not found" }, { status: 404 });
  }

  const posts = await prisma.post.findMany({
    where: { authorId: id },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      published: true,
      createdAt: true,
      _count: { select: { comments: true, postLikes: true, bookmarks: true } },
      postLikes: { select: { userId: true } },
      bookmarks: { select: { userId: true } },
    },
  });
  
  
  const totalPosts = userInfo._count.posts;
  const totalPages = Math.ceil(totalPosts / limit);
  const hasNextPage = page < totalPages;

  return Response.json({
    status: 200,
    message: "User posts fetched successfully",
    user: page === 1 ? userInfo : undefined,
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      limit,
      hasNextPage,
    },
  });
}
