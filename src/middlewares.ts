import fs from "fs";
import jwt from "jsonwebtoken";
import { decodeAppToken, decodeToken } from "./modules/auth/helper";

export const authorize = (token: string) => {
  const appRoot = process.cwd();
  const publicKey = fs.readFileSync(appRoot + "/public.pem");
  try {
    if (token) {
      return jwt.verify(token, publicKey);
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const authorizeApiOneauth = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.sendStatus(401);
    }
    const data = await decodeToken(token);
    if (!data.outcome) {
      return res.sendStatus(401);
    }
    req.user = data.claims;
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
};

export const authorizeApi = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.sendStatus(401);
    }
    const localData = await decodeAppToken(token);
    if (!localData.outcome) {
      return res.sendStatus(401);
    }
    const localClaims: any = localData.claims;
    req.user = localClaims;
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
};


export const authorizeApiRead = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      next();
    } else {
      const localData = await decodeAppToken(token);
      if (!localData.outcome) {
        next();
      } else {
        const localClaims: any = localData.claims;
        req.user = localClaims;
        next();
      }
    }
  } catch (err) {
    console.log(err);
    next();
  }
};
