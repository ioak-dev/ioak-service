import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const addMember = async (req: any, res: any) => {
  const member: any = await Helper.addMember(req.body);
  res.status(200);
  res.send(member);
  res.end();
};

export const updateMember = async (req: any, res: any) => {
  const code = req.userId;
  const member: any = await Helper.updateMember(req.params.id, req.body, code);
  res.status(200);
  res.send(member);
  res.end();
};

export const getMember = async (req: any, res: any) => {
  const userId = req.userId;
  console.log(userId);
  const memberList: any = await Helper.getMember();
  res.status(200);
  res.send(memberList);
  res.end();
};

export const getMemberById = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const member: any = await Helper.getMemberById(req.params.id);
  res.status(200);
  res.send(member);
  res.end();
};
