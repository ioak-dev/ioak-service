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

const adminKey = process.env.ADMIN_KEY || "1234";

const appRoot = process.cwd();

export const addMember = async (data: any) => {
  const model = getCollection(memberCollection, memberSchema);
  const existingMember = await model.find({ email: data.email })
  if (existingMember.length > 0) {
    console.log("----", existingMember[0].email, existingMember[0]._doc);
    _sendRegistrationConfirmation(existingMember[0].email, existingMember[0].firstName, existingMember[0].lastName);
    return "EMAIL_EXISTS";
  }
  _sendRegistrationConfirmation(existingMember.email, existingMember.firstName, existingMember.lastName);
  return await model.create({
    ...data,
    from: parse(data.memberDate, "yyyy-MM-dd", new Date()),
    code: uuidv4(),
    memberId: await nextval({
      field: "memberId"
    }),
    status: "Registered",
    views: 0
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
  console.log("****", email);
  sendMail({
    to: email,
    subject: "IOAK registration confirmation",
    html: emailBody,
  });
}

export const updateMember = async (memberId: string, data: any) => {
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

  return member;
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
  return response;
}