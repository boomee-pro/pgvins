import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email("Email requise."),
  password: z.string().min(8, {
    message: "Le mot de passe doit comporter au minimum 8 caractères",
  }),
  name: z.string().min(1, { message: "Le prénom est requis." }),
});

export const WineSchema = z.object({
  name: z.string().min(1),
  origin: z.string().min(1),
  price: z.number().max(10000),
});

export const GetByIDSchema = z.object({
  id: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email("Email requise."),
  password: z.string().min(8, {
    message: "Le mot de passe doit comporter au minimum 8 caractères",
  }),
});

export type RegisterData = z.infer<typeof RegisterSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
