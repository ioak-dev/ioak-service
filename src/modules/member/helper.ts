const axios = require("axios");
import { parse } from "date-fns";
import { memberCollection, memberSchema } from "./model";
import { format } from "date-fns";
const { getCollection } = require("../../lib/dbutils");
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import { convertMessage, sendMail } from "../../lib/mailutils";
import { processFileUpload } from "../../lib/minioutils";
import { nextval } from "../sequence/service";
import { hashPassword } from "../../lib/authutils";

const adminKey = process.env.ADMIN_KEY || "1234";

const appRoot = process.cwd();

const updateCode = async (memberId: String, code: string) => {
  const model = getCollection(memberCollection, memberSchema);
  const response = await model.findByIdAndUpdate(
    memberId, { code: await hashPassword(code) },
    { new: true, upsert: true }
  );
}

export const addMember = async (data: any) => {
  const model = getCollection(memberCollection, memberSchema);
  const existingMember = await model.find({ email: data.email })
  const code = uuidv4();
  if (existingMember.length > 0) {
    const member = existingMember[0];
    await updateCode(member._id, code);
    _sendRegistrationConfirmation(member.email, member.firstName, member.lastName, member.memberId, code);
    return "EMAIL_EXISTS";
  }
  const member = await model.create({
    ...data,
    email: data.email.toLowerCase(),
    from: parse(data.memberDate, "yyyy-MM-dd", new Date()),
    memberId: await nextval({
      field: "memberId"
    }),
    status: "Registered",
    views: 0,
    code: await hashPassword(code)
  });
  _sendRegistrationConfirmation(member.email, member.firstName, member.lastName, member.memberId, code);
  return toMember(member);
};

const _sendRegistrationConfirmation = (email: string, firstName: string, lastName: string, memberId: number, password: string) => {

  const emailBodyTemplate = fs.readFileSync(
    appRoot + "/src/emailtemplate/RegistrationConfirmation.html"
  );

  const emailBody = convertMessage(emailBodyTemplate.toString(), [
    { name: "TEMPLATE_USER_DISPLAY_NAME", value: `${firstName} ${lastName}` },
    { name: "TEMPLATE_USER_PASSWORD", value: password },
    { name: "TEMPLATE_URL", value: `https://members.ioak.io/#/member/${memberId}/edit` }
  ]);
  sendMail({
    to: email,
    subject: "IOAK registration confirmation",
    html: emailBody,
  });
}

export const updateMember = async (memberId: string, data: any) => {
  const model = getCollection(memberCollection, memberSchema);
  const response = await model.findByIdAndUpdate(
    memberId, { ...data, email: data.email.toLowerCase(), status: data.status === "Registered" ? "Active" : data.status },
    { new: true, upsert: true }
  );
  return toMember(response);
};

export const getMember = async () => {
  const model = getCollection(memberCollection, memberSchema);

  const members: any = await model.find();
  return members.map((member: any) => toMember(member._doc));
};

export const getMemberById = async (id: string) => {
  const model = getCollection(memberCollection, memberSchema);

  const memberResponse = await model.findOne({ _id: id });

  return toMember(memberResponse._doc);
};

export const getMemberByMemberId = async (memberId: string, userId: string | null, trackViewCount?: boolean) => {
  console.log("userId=", userId, memberId);
  const model = getCollection(memberCollection, memberSchema);

  const memberResponse = await model.findOne({ memberId: memberId });

  if (!memberResponse) {
    return null;
  }

  const member = memberResponse._doc;

  if (trackViewCount) {
    await model.findByIdAndUpdate(
      member._id, { ...member, views: (member.views || 0) + 1 },
      { new: true, upsert: true }
    );
  }

  // console.log(member);

  return toMember(member);
};

export const updateMemberAvatar = async (id: string, file: any) => {
  const model = getCollection(memberCollection, memberSchema);
  const extension = file.originalname.substr(file.originalname.lastIndexOf("."));
  const filename = `${id}${extension}`;
  const fileurl = await processFileUpload("avatar", filename, file);
  const response = await model.findByIdAndUpdate(
    id, { profilePic: fileurl },
    { new: true, upsert: true }
  );
  return toMember(response);
}

export const forgotPassword = async (email: string) => {
  const model = getCollection(memberCollection, memberSchema);
  const existingMember = await model.find({ email: email.toLowerCase() })
  if (existingMember.length > 0) {
    const member = existingMember[0];
    const code = uuidv4();
    await updateCode(member._id, code);
    _sendRegistrationConfirmation(member.email, member.firstName, member.lastName, member.memberId, code);
    return true;
  }
  return false;
};

export const toMember = (member: any) => {
  let { code, ...response }: any = { ...member }
  return response;
}