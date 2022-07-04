// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { winesRouter } from "./wines";
import { authRouter } from "./auth";
import { stripeRouter } from "./stripe";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("wines.", winesRouter)
  .merge("auth.", authRouter)
  .merge("stripe.", stripeRouter);

export type AppRouter = typeof appRouter;
