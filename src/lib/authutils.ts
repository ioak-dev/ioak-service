import bcrypt from "bcrypt";

const { AuthenticationError } = require("apollo-server-express");


export const isUnauthorized = (user: any) => {
  if (!user) {
    return new AuthenticationError("Not authorized to access this content");
  }
  return false;
};


export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  // const hash = await bcrypt.hash(password, 10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
  const result = await bcrypt.compare(password, hash);
  return result;
}

// module.exports = { isUnauthorized };
