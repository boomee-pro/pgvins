import pick from "lodash/pick";
import { User } from "@prisma/client";

import { encryptPassword } from "./passwords";
import { prisma } from "../server/db/client";

export interface UserParams {
  email: string;
  surname: string;
  forename: string;
  password: string;
}

export const createUser = async (params: UserParams): Promise<User> => {
  const filteredParams = pick(params, [
    "email",
    "surname",
    "forename",
    "password",
  ]);
  const password = await encryptPassword(filteredParams.password);
  const user = await prisma.user.create({
    data: { ...filteredParams, password },
  });

  user.password = "";
  return user;
};
