import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { GetByIDSchema, WineSchema } from "../../utils/types";
import { createRouter } from "./context";

export const winesRouter = createRouter()
  .mutation("add", {
    input: WineSchema,
    async resolve({ ctx, input }) {
      const wine = await ctx.prisma.wine.create({
        data: input,
      });
      return wine;
    },
  })
  .query("all", {
    async resolve({ ctx }) {
      return ctx.prisma.wine.findMany({});
    },
  })
  .query("byId", {
    input: GetByIDSchema,
    async resolve({ ctx, input }) {
      const { id } = input;
      const wine = await ctx.prisma.wine.findUnique({
        where: { id },
      });
      if (!wine) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No wine with id '${id}'`,
        });
      }
      return wine;
    },
  })
  .mutation("edit", {
    input: z.object({
      id: z.string(),
      data: WineSchema,
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const wine = await ctx.prisma.wine.update({
        where: { id },
        data,
      });
      return wine;
    },
  })
  .mutation("delete", {
    input: GetByIDSchema,
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.wine.delete({ where: { id } });
      return {
        id,
      };
    },
  });
