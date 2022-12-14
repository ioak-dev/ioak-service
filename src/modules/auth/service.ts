import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import { memberSchema, memberCollection } from "../member/model";
import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";
import { userCollection } from "../user/model";

const selfRealm = 100;

export const signin = async (req: any, res: any, next: any) => {
  const payload = req.body;
  if (
    !validateMandatoryFields(res, payload, [
      "email",
      "password"
    ])
  ) {
    return;
  }
  const model = getCollection(memberCollection, memberSchema);
  const member: any = await model.findOne({
    email: payload.email
  });
  if (!member) {
    res.status(404);
    res.send({ error: { message: "User with this user name does not exist" } });
    res.end();
    return;
  }

  // const outcome = await bcrypt.compare(payload.password, user.hash);
  const outcome = payload.password === member.code;
  if (!outcome) {
    res.status(401);
    res.send({ error: { message: "Incorrect password" } });
    res.end();
    return;
  }

  const refresh_token = await Helper.createSession({
    id: member._doc._id,
    memberId: member._doc.memberId,
  }
  );

  const access_token = await Helper.getAccessToken(refresh_token);
  res.send({
    token: refresh_token,
    memberId: member._doc.memberId,
    firstName: member._doc.firstName,
    lastName: member._doc.lastName,
    email: member._doc.email,
    profilePic: member._doc.profilePic
  });
  res.end();
};

export const issueToken = async (req: any, res: any, next: any) => {
  const payload = req.body;
  if (
    !validateMandatoryFields(res, payload, [
      "grant_type",
      "realm",
      "refresh_token",
    ])
  ) {
    return;
  }

  if (payload.grant_type === "refresh_token") {
    const access_token = await Helper.getAccessToken(payload.refresh_token);
    if (!access_token) {
      res.status(400);
      res.send({ error: { message: "Refresh token invalid or expired" } });
      res.end();
      return;
    }
    res.status(200);
    res.send({ token_type: "Bearer", access_token });
    res.end();
    return;
  }

  const token = req.params.token;
  const outcome = await Helper.decodeToken(token);
  res.status(200);
  res.send(outcome);
  res.end();
};

export const decodeToken = async (req: any, res: any, next: any) => {
  res.status(200);
  res.send({ ...req.user });
  res.end();
};
