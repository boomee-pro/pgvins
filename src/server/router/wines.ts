import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const winesRouter = createRouter()
  .mutation("add", {
    input: z.object({
      name: z.string().min(1),
      origin: z.string().min(1),
      price: z.number().max(10000),
    }),
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
    input: z.object({
      id: z.string(),
    }),
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
      data: z.object({
        name: z.string().min(1),
        origin: z.string().min(1),
        price: z.number().max(10000),
      }),
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
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      await ctx.prisma.wine.delete({ where: { id } });
      return {
        id,
      };
    },
  });
