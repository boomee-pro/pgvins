import argon2 from "argon2";

import { createRouter } from "./context";
import { RegisterSchema } from "../../utils/types";

export const authRouter = createRouter().mutation("signup", {
  input: RegisterSchema,
  async resolve({ ctx, input }) {
    const hashedPassword = await argon2.hash(input.password);
    const user = await ctx.prisma.user.create({
      data: { ...input, password: hashedPassword },
    });
    user.password = "";
    return user;
  },
});
