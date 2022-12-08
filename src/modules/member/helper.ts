const axios = require("axios");
import { parse } from "date-fns";
const ONEAUTH_API = process.env.ONEAUTH_API || "http://localhost:4010/api";
import { memberCollection, memberSchema } from "./model";
import { format } from "date-fns";
const { getCollection } = require("../../lib/dbutils");
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import { convertMessage, sendMail } from "../../lib/mailutils";

const adminKey = process.env.ADMIN_KEY || "1234";

const appRoot = process.cwd();

export const addMember = async (data: any) => {
  const model = getCollection(memberCollection, memberSchema);
  const existingMember = await model.find({ email: data.email })
  if (existingMember.length > 0) {
    return "EMAIL_EXISTS";
  }
  return await model.create({
    ...data,
    from: parse(data.memberDate, "yyyy-MM-dd", new Date()),
    code: uuidv4(),
    status: "Registered"
  });
};

const _sendRegistrationConfirmation = (email: string, firstName: string, lastName: string) => {

  const emailBodyTemplate = fs.readFileSync(
    appRoot + "/src/emailtemplate/RegistrationConfirmation.html"
  );

  const emailBody = convertMessage(emailBodyTemplate.toString(), [
    { name: "TEMPLATE_USER_DISPLAY_NAME", value: `${firstName} ${lastName}` },
    { name: "TEMPLATE_MEMBER_PAGE_URL", value: "http" }
  ]);

  sendMail({
    to: email,
    subject: "IOAK registration confirmation",
    html: emailBody,
  });
}

export const updateMember = async (memberId: string, data: any, code: string) => {
  const model = getCollection(memberCollection, memberSchema);
  return await model.findByIdAndUpdate(
    memberId, { ...data, status: data.status === "Registered" ? "Active" : data.status },
    { new: true, upsert: true }
  );
};

export const getMember = async () => {
  const model = getCollection(memberCollection, memberSchema);

  return await model.find();
};

export const getMemberById = async (id: string) => {
  const model = getCollection(memberCollection, memberSchema);

  const memberResponse = await model.findOne({ _id: id });

  return {
    ...memberResponse._doc
  };
};
