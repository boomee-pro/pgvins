import { z } from "zod";
import argon2 from "argon2";

import { createRouter } from "./context";

export const authRouter = createRouter().mutation("signup", {
  // data already validated in front-end ?
  input: z.object({
    email: z.string().email("Email required."),
    password: z.string().min(8, { message: "Must be 8-length min" }),
    surname: z.string().min(1),
    forename: z.string().min(1),
  }),
  async resolve({ ctx, input }) {
    const hashedPassword = await argon2.hash(input.password);
    const user = await ctx.prisma.user.create({
      data: { ...input, password: hashedPassword },
    });
    user.password = "";
    return user;
  },
});
