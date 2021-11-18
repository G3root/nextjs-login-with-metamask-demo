import type { NextRequest } from "next/server";
import type { NextApiRequest } from "next";
import { jwtVerify } from "jose";
import { COOKIE_NAME, SECRET } from "@/configs";
import { jsonResponse } from "./utils";

interface UserJwtPayload {
  user?: {
    id: string;
    nonce: string;
    publicAddress: string;
    username: null | string;
  };
  jti: string;
  iat: number;
}

/**
 * Verifies the user's JWT token and returns the payload if
 * it's valid or a response if it's not.
 */
export async function verifyAuth(request: NextRequest) {
  const token = request.cookies[COOKIE_NAME];

  if (!token) {
    return jsonResponse(401, {
      error: { message: "Missing user token" },
      success: false,
    });
  }

  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(SECRET));
    return verified.payload as UserJwtPayload;
  } catch (err) {
    return jsonResponse(401, {
      error: { message: "Your token has expired." },
      success: false,
    });
  }
}
