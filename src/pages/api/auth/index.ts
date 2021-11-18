import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";
import { z } from "zod";
import { nanoid } from "nanoid";
import { utils } from "ethers";
import { withValidation } from "next-validations";
import { COOKIE_EXPIRATION, COOKIE_NAME, SECRET } from "@/configs";
import nookies from "nookies";
import { SignJWT } from "jose";
const schema = z.object({
  address: z.string().min(1),
  signature: z.string().min(1),
});

const validate = withValidation({
  schema,
  type: "Zod",
  mode: "body",
});
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    body: { address, signature },
  } = req;

  switch (method) {
    case "POST":
      const user = await prisma.user.findUnique({
        where: {
          publicAddress: address as string,
        },
      });
      if (!user) {
        return res.status(404).json({
          error: { message: "User not found" },
          success: false,
        });
      }

      const msg = `I am signing my one-time nonce: ${user.nonce}`;
      const verifiedAddress = utils.verifyMessage(msg, signature);
      const isVerified =
        verifiedAddress.toLowerCase() === verifiedAddress.toLowerCase();

      if (!isVerified) {
        return res.status(404).json({
          error: { message: "claim has been compromised or malformed" },
          success: false,
        });
      }
      if (isVerified) {
        const updateNonce = await prisma.user.update({
          where: { id: user.id },
          data: {
            nonce: nanoid(10),
          },
        });
        const token = await new SignJWT({ user: { ...updateNonce } })
          .setProtectedHeader({ alg: "HS256" })
          .setJti(nanoid())
          .setIssuedAt()
          .setExpirationTime(COOKIE_EXPIRATION)
          .sign(new TextEncoder().encode(SECRET));

        nookies.set({ res }, COOKIE_NAME, token, {
          maxAge: 7200, // 2 hours in seconds
          path: "/",
          httpOnly: true,
        });

        return res.status(200).json({
          success: true,
        });
      }

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
export default validate(handler);
