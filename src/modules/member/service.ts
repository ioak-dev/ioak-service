import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const addMember = async (req: any, res: any) => {
  const member: any = await Helper.addMember(req.body);
  if (member === "EMAIL_EXISTS") {
    res.status(409);
    res.end();
    return;
  }
  res.status(200);
  res.send(member);
  res.end();
};

export const updateMember = async (req: any, res: any) => {
  const id = req.user.id;
  const memberId = req.user.memberId;
  if (req.params.id !== id) {
    res.status(401);
    res.end();
  } else {
    const member: any = await Helper.updateMember(req.params.id, req.body);
    res.status(200);
    res.send(member);
    res.end();
  }
};

export const getMember = async (req: any, res: any) => {
  const userId = req.userId;
  console.log(userId);
  const memberList: any = await Helper.getMember();
  res.status(200);
  res.send(memberList);
  res.end();
};

export const uploadMemberAvatar = async (req: any, res: any) => {
  const id = req.user.id;
  const memberId = req.user.memberId;
  if (req.params.id !== id) {
    res.status(401);
    res.end();
  } else {
    const response: any = await Helper.updateMemberAvatar(req.params.id, req.file);
    res.status(200);
    res.send(response);
    res.end();
  }
};

export const getMemberById = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const member: any = await Helper.getMemberById(req.params.id);
  res.status(200);
  res.send(member);
  res.end();
};


export const getMemberByMemberId = async (req: any, res: any) => {
  const userId = req.userId;
  const member: any = await Helper.getMemberByMemberId(req.params.memberid, userId, true);
  console.log(member);
  if (!member) {
    res.status(404);
    res.end();
    return;
  }
  res.status(200);
  res.send(member);
  res.end();
};


export const getMemberByMemberIdForEdit = async (req: any, res: any) => {
  const member: any = await Helper.getMemberByMemberId(req.params.memberid, null, false);
  if (!member) {
    res.status(404);
    res.end();
    return;
  }
  res.status(200);
  res.send(member);
  res.end();
};
