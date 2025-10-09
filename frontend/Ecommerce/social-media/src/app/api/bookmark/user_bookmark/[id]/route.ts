import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { UserBookmarksResponse } from "@/lib/type";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const skip = (page - 1) * limit;

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { status: 400, message: "User ID is required", data: null },
        { status: 400 }
      );
    }

    const userBookmarks = await prisma.bookmark.findMany({
      where: { userId: id },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            createdAt: true,
            postLikes: {
              select: { userId: true },
            },
            _count: {
              select: { postLikes: true, comments: true },
            }
          },
        },
        user: { select: { id: true, name: true, image: true } }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    
    const totalBookmarks = await prisma.bookmark.count({
      where: { userId: id },
    });

    const totalPages = Math.ceil(totalBookmarks / limit);

    const response = {
      status: 200,
      message: "Bookmarks fetched successfully",
      data: userBookmarks,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookmarks,
        limit,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (e: any) {
    console.error("Error fetching bookmarks:", e);

    return NextResponse.json(
      {
        status: 500,
        message: "Internal Server Error",
        error: e.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
