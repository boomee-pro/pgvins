import argon2 from "argon2";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "../../../server/db/client";

export default NextAuth({
  theme: {
    colorScheme: "light",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  useSecureCookies:
    process.env.NODE_ENV && process.env.NODE_ENV === "production",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@domain.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.password || !credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;
        if (!(await argon2.verify(user.password, credentials.password))) {
          return null;
        }

        return {
          id: user.id,
          surname: user.surname,
          forename: user.forename,
          email: user.email,
        };
      },
    }),
  ],
});
