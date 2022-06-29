// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { winesRouter } from "./wines";
import { authRouter } from "./auth";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("wines.", winesRouter)
  .merge("auth.", authRouter);

export type AppRouter = typeof appRouter;
