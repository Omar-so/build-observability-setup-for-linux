import { NextRequest } from "next/server";
import data from "./comment"
// const dynmuc = "force-static"  for cache there are react cach and unstable cache in next js react cache to not undouble fetch and unsstacle cache it and i can use revildate to refetch after time this with fun and with fetch use cache no not cache or revildate
// export const dynamic = "force-dynamic"
// export const revalidate = 10 // refetch after 10 second
// export const dynamic = "force-static"
// export const fetchCache = "force-no-store"
// export const fetchCache = "only-if-cached"

// If you export a function named `GET`, `POST`, `PUT`, `DELETE` or `PATCH`
// the corresponding HTTP method will be supported.
export async function GET() {
  return new Response(JSON.stringify(data));
}

export async function POST(req: Request) {
  const body = await req.json();
  
  if (typeof body.comment === 'string') {
    data.comments.push(body.comment);
    data.total += 1;
  }

  return new Response(JSON.stringify({
    message: "Data received",
    data: data
  }));
}

import {NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  // Get JSON body
  const data = await req.json();
  console.log(data);

  // Get Authorization header
  const header = req.headers.get('authorization');
  console.log(header);

  // Get query param
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get('user');

  // Return JSON response
  return NextResponse.json({
    message: `Hello, ${user}`,
    status: 200,
    data: "Deleted Successfully"
  });
}
// headers: { 'Content-Type': 'application/json'  , set-cookie: 'name=value; HttpOnly' } headers are not send auto like cookie set cookie are header like cookei