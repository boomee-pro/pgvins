import { NextApiRequest, NextApiResponse } from "next";
import { login } from "../../../utils/auth";
import { clearSession, setSession } from "../../../utils/sessions";

const sessionsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      const user = await login(req.body);
      if (user) {
        setSession(res, user);
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
      break;

    case "DELETE":
      clearSession(res);
      res.status(204);
      break;

    default:
      res.status(405).json({ error: "Method not allowed." });
      break;
  }
};

export default sessionsHandler;
