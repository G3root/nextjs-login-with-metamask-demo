import type { NextApiRequest, NextApiResponse } from "next";
import { COOKIE_NAME } from "@/configs";
import nookies from "nookies";
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case "GET":
      const cookie = req.cookies[COOKIE_NAME];
      if (!cookie) {
        return res.status(401).json({
          error: { message: "You must be logged in." },
          success: false,
        });
      }
      if (cookie) {
        nookies.set({ res }, COOKIE_NAME, "", {
          maxAge: 1,
          path: "/",
          httpOnly: true,
        });
        return res.status(200).json({
          success: true,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
export default handler;
