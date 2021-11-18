import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db";
import { z } from "zod";

import { withValidation } from "next-validations";

const schema = z.object({
  address: z.string().min(1),
});

const validate = withValidation({
  schema,
  type: "Zod",
  mode: "query",
});
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { address },
    method,
  } = req;

  switch (method) {
    case "GET":
      const user = await prisma.user.findUnique({
        where: {
          publicAddress: address as string,
        },
      });
      if (!user) {
        return res.status(404).json({ success: false });
      }
      if (user) {
        return res.status(200).json({ success: true, user: user });
      }

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
export default validate(handler);
