import primsa from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query) {
    return new Response(
      JSON.stringify({
        status: 400,
        message: 'Query parameter "q" is required',
        data: null,
      }),
      { status: 400 }
    );
  }

  try {
    const users = await primsa.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
      take: 10,
    }); 
    
    return new Response(
      JSON.stringify({
        status: 200,
        message: 'Users fetched successfully',
        data: users,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error searching users:', error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: 'Internal Server Error',
        data: null,
      }),
      { status: 500 }
    );
  }
}