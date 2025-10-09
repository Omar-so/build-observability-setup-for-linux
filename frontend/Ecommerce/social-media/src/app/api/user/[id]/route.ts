import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 Promise here
) {
  const { id } = await params;

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

  return Response.json({
    status: 200,
    message: "User posts fetched successfully",
    user: userInfo ,
  });
}
