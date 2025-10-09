import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const params = await req.nextUrl.searchParams;

        const postId = params.get('postId');
        const userId = params.get('userId');

        console.log("Received like request:", { postId, userId });
        if (!postId || !userId) {
            return new Response(JSON.stringify({
                status: 400,
                message: "postId and userId are required",
                data: null
            }), { status: 400 });
        }

        // Check if the like already exists
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId
                }
            }
        });

        if (existingLike) {
            // If like exists, remove it (unlike)
            await prisma.like.delete({
                where: {
                    postId_userId: {
                        postId,
                        userId
                    }
                }
            });

            return new Response(JSON.stringify({
                status: 200,
                message: "Post unliked successfully",
                data: null
            }), { status: 200 });
        } else {
            // If like doesn't exist, create it
            const newLike = await prisma.like.create({
                data: {
                    postId,
                    userId
                }
            });

            return new Response(JSON.stringify({
                status: 201,
                message: "Post liked successfully",
                data: newLike
            }), { status: 201 });
        }
    } catch (error) {
        console.error("Error handling like/unlike:", error);
        return new Response(JSON.stringify({
            status: 500,
            message: "Internal Server Error",
            data: null
        }), { status: 500 });
    }
}

