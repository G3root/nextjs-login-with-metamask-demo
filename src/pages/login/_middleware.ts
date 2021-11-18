import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/auth";
export async function middleware(req: NextRequest) {
  const resOrPayload = await verifyAuth(req);
  const isJSONResponse = resOrPayload instanceof Response;

  return isJSONResponse ? NextResponse.next() : NextResponse.redirect("/");
}
