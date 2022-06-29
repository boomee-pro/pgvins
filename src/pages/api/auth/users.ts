import { NextApiRequest, NextApiResponse } from "next";
import { setSession } from "../../../utils/sessions";
import { createUser } from "../../../utils/users";

const usersHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await createUser(req.body);
  setSession(res, user);
  res.status(200).json(user);
};

export default usersHandler;
