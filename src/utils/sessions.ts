import { User } from "@prisma/client";
import { CookieSerializeOptions, serialize } from "cookie";
import { NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { IncomingMessage } from "http";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

import { prisma } from "../server/db/client";

const JWT_TOKEN_KEY = process.env.JWT_TOKEN || "super secret key";
const COOKIES_OPTIONS = {
  httpOnly: true,
  maxAge: 2592000,
  path: "/",
  sameSite: true,
  secure: process.env.NODE_ENV === "production",
};

const setCookie = (
  res: NextApiResponse,
  name: string,
  value: string,
  options: CookieSerializeOptions | undefined = {}
) => {
  const strValue =
    typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value);

  res.setHeader("Set-Cookie", serialize(name, String(strValue), options));
};

export const setSession = (res: NextApiResponse, user: User) => {
  const token = jwt.sign({ email: user.email }, JWT_TOKEN_KEY, {
    expiresIn: "1d",
  });

  setCookie(res, "auth", token, COOKIES_OPTIONS);
};

export const clearSession = (res: NextApiResponse) => {
  setCookie(res, "auth", "0", { ...COOKIES_OPTIONS, path: "/", maxAge: 1 });
};

export const parseRequest = async (
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<User | undefined> => {
  const { auth: token } = req.cookies;

  if (!token) return undefined;

  try {
    const data = jwt.verify(token, JWT_TOKEN_KEY);
    if (!data) return undefined;
    const user = await prisma.user.findUnique({
      where: { email: (data as any).email },
    });
    if (user) {
      user.password = "";
      return user;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};
