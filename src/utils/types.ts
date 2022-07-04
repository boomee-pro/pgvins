import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email requise."),
  password: z.string().min(8, {
    message: "Le mot de passe doit comporter au minimum 8 caractères",
  }),
  name: z.string().min(1, { message: "Le prénom est requis." }),
});

export type RegisterData = z.infer<typeof registerSchema>;

export const WineSchema = z.object({
  name: z.string().min(1),
  origin: z.string().min(1),
  price: z.number().max(10000),
});

export const getByIDSchema = z.object({
  id: z.string(),
});
