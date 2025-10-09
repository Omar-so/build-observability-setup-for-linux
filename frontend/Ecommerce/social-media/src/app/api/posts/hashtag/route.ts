import prisma from '@/lib/prisma';


function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}
 
export async function GET() {
  try {
    const topHashtags = await prisma.$queryRaw<
      { tag: string; count: number }[]
    >`
      SELECT hashtag AS tag, COUNT(*) AS count
      FROM (
        SELECT unnest(regexp_matches(content, '#[A-Za-z0-9_]+', 'g')) AS hashtag
        FROM "Post"
      ) t
      GROUP BY hashtag
      ORDER BY count DESC
      LIMIT 5;
    `;
    const serializedData = serializeBigInt(topHashtags);
    return new Response(
      JSON.stringify({
        status: 200,
        message: "Top hashtags fetched successfully",
        data: serializedData,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching hashtags:", error);
    return new Response(
      JSON.stringify({
        status: 500,
        message: "Internal Server Error",
        data: null,
      }),
      { status: 500 }
    );
  }
}
