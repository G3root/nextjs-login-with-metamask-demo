import type { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { verifyAuth } from "@/auth";
import { jsonResponse } from "@/utils";

export async function middleware(req: NextRequest) {
  const resOrPayload = await verifyAuth(req);

  return resOrPayload instanceof Response
    ? resOrPayload
    : jsonResponse(200, {
        jwtID: resOrPayload.jti,
        success: true,
        user: resOrPayload.user,
      });
}
