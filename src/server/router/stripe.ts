import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { formatAmountFromStripe } from "../../utils/stripe";
import { createRouter } from "./context";

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

export const stripeRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .mutation("checkout_session", {
    input: z.object({
      price: z.number().min(1).max(10),
      quantity: z.number().min(1).max(10),
      name: z.string().min(1),
    }),
    async resolve({ input, ctx }) {
      const session = await stripe.checkout.session.create({
        payment_method_types: ["card"],
        line_items: {
          name: input.name,
          amount: formatAmountFromStripe(input.price, "EUR"),
          currency: "EUR",
          quantity: input.quantity,
        },
        success_url: `${ctx.req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}/shop/test`,
      });
      return session;
    },
  });
