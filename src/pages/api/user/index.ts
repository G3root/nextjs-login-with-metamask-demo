import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";
import { z } from "zod";
import { nanoid } from "nanoid";
import { withValidation } from "next-validations";

const schema = z.object({
  address: z.string().min(1),
});

const validate = withValidation({
  schema,
  type: "Zod",
  mode: "body",
});
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    body: { address },
  } = req;

  switch (method) {
    case "POST":
      const isExist = await prisma.user.findUnique({
        where: {
          publicAddress: address,
        },
      });
      if (isExist) {
        return res.status(404).json({ success: false });
      }
      if (!isExist) {
        const user = await prisma.user.create({
          data: {
            publicAddress: address as string,
            nonce: nanoid(10),
          },
        });
        return res.status(200).json({ success: true, user });
      }

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
export default validate(handler);
