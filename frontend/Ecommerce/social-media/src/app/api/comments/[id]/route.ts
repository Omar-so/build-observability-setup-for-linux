import { updateCommentSchema } from '@/lib/type';
import prisma from '@/lib/prisma';

// Update comment
export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const body = await req.json();
    // await params because in App Router params are async
    const { id } = await params;

    const validatedData = updateCommentSchema.safeParse(body);
    if (!validatedData.success) {
      return new Response(
        JSON.stringify({
          status: 400,
          message: "Invalid input",
          errors: validatedData.error.errors,
        }),
        { status: 400 }
      );
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: { content: validatedData.data.content },
    });

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Comment updated successfully",
        data: comment,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// Delete comment
export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const { id } = await params;

    await prisma.comment.delete({ where: { id } });

    return new Response(
      JSON.stringify({
        status: 200,
        message: "Comment deleted successfully",
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
