import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const uploadImage = async (req: any, res: any) => {
  // const userId = req.user.id;
  const image: any = await Helper.uploadImage(req.file);
  res.status(200);
  res.send(image);
  res.end();
};

export const uploadImageWriteup = async (req: any, res: any) => {
  // const userId = req.user.id;
  const image: any = await Helper.uploadImage(req.file, "writeup-demo");
  res.status(200);
  res.send(image);
  res.end();
};
