import { User } from "@prisma/client";

import { prisma } from "../server/db/client";
import { verifyPassword } from "./passwords";

export interface LoginParams {
  email: string;
  password: string;
}

export const login = async (params: LoginParams): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { email: params.email } });

  if (!user) return null;

  if (await verifyPassword(user.password, params.password)) {
    user.password = "";
    return user;
  }

  return null;
};
