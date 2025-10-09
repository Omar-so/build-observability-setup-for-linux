import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { followerId, followingId } = await req.json();

        if (!followerId || !followingId) {
            return new Response(JSON.stringify({
                status: 400,
                message: "followerId and followingId are required",
                data: null
            }), { status: 400 });
        }

        // Check if the follow already exists
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });

        if (existingFollow) {
            // If follow exists, remove it (unfollow)
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId
                    }
                }
            });

            return new Response(JSON.stringify({
                status: 200,
                message: "Unfollowed successfully",
                data: null
            }), { status: 200 });
        } else {
            // If follow doesn't exist, create it
            const newFollow = await prisma.follow.create({
                data: {
                    followerId,
                    followingId
                }
            });

            return new Response(JSON.stringify({
                status: 201,
                message: "Followed successfully",
                data: newFollow
            }), { status: 201 });
        }
    } catch (error) {
        console.error("Error handling follow/unfollow:", error);
        return new Response(JSON.stringify({
            status: 500,
            message: "Internal Server Error",
            data: null
        }), { status: 500 });
    }
}
