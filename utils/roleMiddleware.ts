import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

const roleMiddleware =
  (handler, allowedRoles) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    // Allow GET requests for any user, authenticated or not
    if (req.method === "GET") {
      return handler(req, res);
    }

    if (!session) {
      return res
        .status(401)
        .json({ message: "You must be logged in to access this resource" });
    }

    if (!allowedRoles.includes(session.role)) {
      return res
        .status(403)
        .json({ message: "You do not have access to this resource" });
    }

    return handler(req, res);
  };

export default roleMiddleware;
