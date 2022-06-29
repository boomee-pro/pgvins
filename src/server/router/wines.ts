import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import { prisma } from "../db/client";

const defaultWineSelect = Prisma.validator<Prisma.WineSelect>()({
  id: true,
  name: true,
  origin: true,
  price: true,
});

export const winesRouter = createRouter()
  .mutation("add", {
    input: z.object({
      name: z.string().min(1),
      origin: z.string().min(1),
      price: z.number().max(10000),
    }),
    async resolve({ input }) {
      const wine = await prisma.wine.create({
        data: input,
        select: defaultWineSelect,
      });
      return wine;
    },
  })
  .query("all", {
    async resolve() {
      return prisma.wine.findMany({
        select: defaultWineSelect,
      });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const wine = await prisma.wine.findUnique({
        where: { id },
        select: defaultWineSelect,
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
    async resolve({ input }) {
      const { id, data } = input;
      const wine = await prisma.wine.update({
        where: { id },
        data,
        select: defaultWineSelect,
      });
      return wine;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.wine.delete({ where: { id } });
      return {
        id,
      };
    },
  });
