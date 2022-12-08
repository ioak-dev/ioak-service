import jwt from "jsonwebtoken";
import { decodeToken } from "./modules/auth/helper";

const jwtsecret = "jwtsecret";

export const authorize = (token: string) => {
  try {
    if (token) {
      return jwt.verify(token, jwtsecret);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const authorizeApi = async (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];
  req.userId = token;
  next();
};
