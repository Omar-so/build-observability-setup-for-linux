import prisma from '@/lib/prisma'
import { Post } from '@/lib/type';
import { createPostSchema, updatePostSchema } from '@/lib/type';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        
        // Get pagination parameters with defaults
        const page = Math.max(1, Number(searchParams.get('page')) || 1);
        const take = Math.max(1, Number(searchParams.get('limit')) || 10);
        const skip = (page - 1) * take;
        
        // Get total count for pagination
        const totalPosts = await prisma.post.count();

        // Get paginated data with relations
        const data = await prisma.post.findMany({
            take,
            skip,
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  createdAt: true,
                },
              },
              comments: {
                select: {
                  id: true,
                  createdAt: true,
                  content: true,
                  author: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                      createdAt: true,
                    },
                  },
                },
              },
              postLikes: {
                select: {
                  userId: true,
                },
              },
              bookmarks: {
                select: {
                  userId: true,
                },
              },
              _count: {
                select: {
                  postLikes: true,
                  comments: true,
                },
              },
            },
          });
          
        return new Response(JSON.stringify({
            status: 200,
            message: "Posts fetched successfully",
            data,
            metadata: {
                total_posts: totalPosts,
                total_pages: Math.ceil(totalPosts / take),
                current_page: page,
                per_page: take
            }
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            status: 500,
            message: "Internal server error",
        }), { status: 500 });
    }
}

export async function POST(req: Request) { 
    try {
        const body = await req.json();

        const validatedData = createPostSchema.safeParse(body); 


        if (!validatedData.success) {
            return new Response(JSON.stringify({
                status: 400, 
                message: "Invalid input",
            }), { status: 400 });
        }
       
        console.log(validatedData.data);
        const created = await prisma.post.create({
            data: validatedData.data 
        });
        
        return new Response(JSON.stringify({
            status: 201,
            message: "Post Created Successfully",
            data: created
        }), { status: 201 });
    } catch (error) {
        console.error("Post creation error:", error);
        return new Response(JSON.stringify({
            status: 500,
            message: "Internal Server Error"
        }), { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return new Response(JSON.stringify({
                status: 400,
                message: "Post ID is required"
            }), { status: 400 });
        }

        const validatedData = updatePostSchema.safeParse(updateData); // ✅ Fixed: removed await

        if (!validatedData.success) {
            return new Response(JSON.stringify({
                status: 400,
                message: "Invalid input",
                errors: validatedData.error.errors
            }), { status: 400 });
        }

        const updated = await prisma.post.update({
            where: { id },
            data: validatedData.data
        });

        return new Response(JSON.stringify({
            status: 200,
            message: "Post Updated Successfully",
            data: updated
        }), { status: 200 });
    } catch (error: any) { // ✅ Added error type
        if (error.code === 'P2025') {
            return new Response(JSON.stringify({
                status: 404,
                message: "Post not found"
            }), { status: 404 });
        }

        console.error("Post update error:", error);
        return new Response(JSON.stringify({
            status: 500,
            message: "Internal Server Error"
        }), { status: 500 });
    }
}

export async function DELETE(req: NextRequest) { 
    try {
        const searchParams = req.nextUrl.searchParams;
        const postId = searchParams.get('post-id');
        
        if (!postId) {
            return new Response(JSON.stringify({
                status: 400,
                message: "Post ID is required"
            }), { status: 400 });
        }

        await prisma.post.delete({
            where: {
                id: postId
            }
        });
        
        return new Response(JSON.stringify({
            status: 200,
            message: "Post Deleted Successfully"
        }), { status: 200 });
    } catch (error: any) { // ✅ Added error type
        if (error.code === 'P2025') {
            return new Response(JSON.stringify({
                status: 404,
                message: "Post not found"
            }), { status: 404 });
        }

        console.error("Post deletion error:", error);
        return new Response(JSON.stringify({
            status: 500,
            message: "Internal Server Error"
        }), { status: 500 });
    }
}