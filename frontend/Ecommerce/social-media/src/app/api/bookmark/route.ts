import prisma from "@/lib/prisma";
import { createBookmarkSchema } from "@/lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData = createBookmarkSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { status: 400, message: "Invalid input", errors: validatedData.error },
        { status: 400 }
      );
    }

    const { postId, userId } = validatedData.data;

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: {
          postId_userId: { postId, userId },
        },
      });

      return NextResponse.json(
        {
          status: 200,
          message: "Bookmark removed successfully",
          data: null,
        },
        { status: 200 }
      );
    }

    const newBookmark = await prisma.bookmark.create({
      data: { postId, userId },
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Post bookmarked successfully",
        data: newBookmark,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error handling bookmark toggle:", error);

    return NextResponse.json(
      {
        status: 500,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
