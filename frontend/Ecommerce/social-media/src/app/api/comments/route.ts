import prisma from '@/lib/prisma';
import { createCommentSchema } from '@/lib/type';
import { NextRequest } from 'next/server';

// Create comment
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validatedData = await createCommentSchema.safeParse(body);
        console.log( "debug ",  validatedData )

        
        if (!validatedData.success) {
            return new Response(JSON.stringify({
                status: 400,
                message: "Invalid input",
            }), { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content: validatedData.data.content,
                postId: validatedData.data.postId,
                authorId: validatedData.data.authorId
            }
        });
        return new Response(JSON.stringify({
            status: 201,
            message: "Comment created successfully",
            data: comment
        }), { status: 201 });
    } catch (error: any) {
        return new Response(JSON.stringify({
            status: 500,
            message: "Internal server error",
        }), { status: 500 });
    }
}

