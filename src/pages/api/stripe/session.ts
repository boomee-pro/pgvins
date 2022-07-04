import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PaymentSchema = z.object({
  price: z.number().min(1),
  quantity: z.number().min(1).max(10),
  name: z.string().min(1),
});

const sessionHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const parsedBody = PaymentSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).send({
        message: "Invalid request body.",
      });
    }

    const { data } = parsedBody;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          name: data.name,
          amount: data.price,
          currency: "EUR",
          quantity: data.quantity,
        },
      ],
      success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/shop/test-payment?success=false`,
    });

    res.status(200).json(session);
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default sessionHandler;
