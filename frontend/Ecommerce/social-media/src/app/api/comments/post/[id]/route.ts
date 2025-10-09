// /api/comment/[id]/route.ts
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; 

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const take = 5;
  const skip = (page - 1) * take;

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: "desc" },
    include : {
        author : {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true
            }
        }
    },
    skip,
    take,
  });

  const nextPage = comments.length < take ? null : page + 1;

  return new Response(
    JSON.stringify({
      data: comments,
      nextPage,
    }),
    { status: 200 }
  );
}
