import argon2 from "argon2";

export const encryptPassword = async (password: string): Promise<string> => {
  return argon2.hash(password);
};

export const verifyPassword = (hash: string, password: string) => {
  return argon2.verify(hash, password);
};
