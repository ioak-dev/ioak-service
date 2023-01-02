import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import jwt from "jsonwebtoken";
import { add, addDays, differenceInSeconds } from "date-fns";

import { hashPassword, comparePassword } from '../../lib/authutils'

import { getCollection } from "../../lib/dbutils";
import { userCollection, userSchema } from "../user/model";
import { memberCollection, memberSchema } from "../member/model";

const selfRealm = 100;
const appUrl = process.env.APP_URL || "http://localhost:3010";

export const createSession = async (member: any) => {
  const appRoot = process.cwd();
  const privateKey = fs.readFileSync(appRoot + "/local_private.pem");
  const refresh_token = jwt.sign(member,
    { key: privateKey, passphrase: "fevicryl" },
    {
      algorithm: "RS256",
      expiresIn: "24h",
    }
  );

  return refresh_token;
};

export const getAccessToken = async (refreshToken: string) => {
  const decoded: any = await decodeToken(refreshToken);
  const claims: any = decoded.claims;
  const appRoot = process.cwd();
  const privateKey = fs.readFileSync(appRoot + "/local_private.pem");
  // const access_token = jwt.sign(
  //   session.claims,
  //   { key: privateKey, passphrase: "no1knowsme" },
  //   {
  //     algorithm: "RS256",
  //     expiresIn: `${refreshTokenDuration}s`,
  //   }
  // );
  // return access_token;
  return null;
};

export const decodeToken = async (token: string) => {
  const appRoot = process.cwd();
  const publicKey = fs.readFileSync(appRoot + "/local_public.pem");
  try {
    const res = await jwt.verify(token, publicKey);
    return { outcome: true, token, claims: res };
  } catch (err) {
    console.log(err);
    return { outcome: false, err };
  }
};

export const getHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const encodeAppToken = (claims: any) => {
  const appRoot = process.cwd();
  const privateKey = fs.readFileSync(appRoot + "/local_private.pem");
  const token = jwt.sign(
    claims,
    { key: privateKey, passphrase: "fevicryl" },
    {
      algorithm: "RS256",
      expiresIn: "100h",
    }
  );
  return token;
};

export const decodeAppToken = async (token: string) => {
  const appRoot = process.cwd();
  const publicKey = fs.readFileSync(appRoot + "/local_public.pem");
  try {
    const res = await jwt.verify(token, publicKey);
    return { outcome: true, token, claims: res };
  } catch (err) {
    console.log(err);
    return { outcome: false, err };
  }
};

export const changepassword = async (userId: String, code: string) => {
  const model = getCollection(memberCollection, memberSchema);
  return await model.findByIdAndUpdate(
    userId, { code: await hashPassword(code) },
    { new: true, upsert: true }
  );
}

export const migrateHash = async () => {
  const model = getCollection(memberCollection, memberSchema);
  const list = await model.find();
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    console.log(item._id, item.code)
    await model.findByIdAndUpdate(
      item._id, { code: await hashPassword(item.code || '123') },
      { new: true, upsert: true }
    );
  }
  return;
}