import { TRPCError } from "@trpc/server";
import { z } from "zod";
import argon2 from "argon2";

import { createRouter } from "./context";
import { prisma } from "../db/client";
import { clearSession, setSession } from "../../utils/sessions";

export const authRouter = createRouter()
  .mutation("login", {
    input: z.object({
      email: z.string().email("Email required."),
      password: z.string().min(8, { message: "Must be 8-length min" }),
    }),
    async resolve({ ctx, input }) {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with email '${input.email}'`,
        });
      }
      if (await argon2.verify(user.password, input.password)) {
        user.password = "";
        setSession(ctx.res, user);
        return user;
      }
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Password doesn't match for email '${input.email}'`,
      });
    },
  })
  .mutation("signup", {
    input: z.object({
      email: z.string().email("Email required."),
      password: z.string().min(8, { message: "Must be 8-length min" }),
      surname: z.string().min(1),
      forename: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      const hashedPassword = await argon2.hash(input.password);
      const user = await prisma.user.create({
        data: { ...input, password: hashedPassword },
      });
      user.password = "";
      setSession(ctx.res, user);
      return user;
    },
  })
  .mutation("logout", {
    async resolve({ ctx }) {
      clearSession(ctx.res);
    },
  });
