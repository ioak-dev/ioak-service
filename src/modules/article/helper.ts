const axios = require("axios");
import { parse } from "date-fns";
import { articleCollection, articleSchema } from "./model";
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

const updateCode = async (articleId: String, code: string) => {
  const model = getCollection(articleCollection, articleSchema);
  const response = await model.findByIdAndUpdate(
    articleId, { code: await hashPassword(code) },
    { new: true, upsert: true }
  );
}

export const addArticle = async (data: any) => {
  const model = getCollection(articleCollection, articleSchema);
  const existingArticle = await model.find({ email: data.email })
  const code = data.code;
  if (existingArticle.length > 0) {
    const article = existingArticle[0];
    await updateCode(article._id, code);
    _sendRegistrationConfirmation(article.email, article.firstName, article.lastName, article.articleId, code);
    return "EMAIL_EXISTS";
  }
  const article = await model.create({
    ...data,
    email: data.email.toLowerCase(),
    from: parse(data.articleDate, "yyyy-MM-dd", new Date()),
    articleId: await nextval({
      field: "articleId"
    }),
    status: "Registered",
    views: 0,
    code: await hashPassword(code)
  });
  _sendRegistrationConfirmation(article.email, article.firstName, article.lastName, article.articleId, code);
  return toArticle(article._doc);
};

const _sendRegistrationConfirmation = (email: string, firstName: string, lastName: string, articleId: number, password: string) => {

  const emailBodyTemplate = fs.readFileSync(
    appRoot + "/src/emailtemplate/RegistrationConfirmation.html"
  );

  const emailBody = convertMessage(emailBodyTemplate.toString(), [
    { name: "TEMPLATE_USER_DISPLAY_NAME", value: `${firstName} ${lastName}` },
    { name: "TEMPLATE_USER_PASSWORD", value: password },
    { name: "TEMPLATE_URL", value: `https://articles.ioak.io/#/article/${articleId}/edit` }
  ]);
  sendMail({
    to: email,
    subject: "IOAK registration confirmation",
    html: emailBody,
  });
}

export const updateArticle = async (articleId: string, data: any) => {
  const model = getCollection(articleCollection, articleSchema);
  const response = await model.findByIdAndUpdate(
    articleId, { ...data, email: data.email.toLowerCase(), status: data.status === "Registered" ? "Active" : data.status },
    { new: true, upsert: true }
  );
  return toArticle(response);
};

export const getArticle = async () => {
  const model = getCollection(articleCollection, articleSchema);

  const articles: any = await model.find();
  return articles.map((article: any) => toArticle(article._doc));
};

export const getArticleById = async (id: string) => {
  const model = getCollection(articleCollection, articleSchema);

  const articleResponse = await model.findOne({ _id: id });

  return toArticle(articleResponse._doc);
};

export const getArticleById = async (articleId: string, userId: string | null, trackViewCount?: boolean) => {
  console.log("userId=", userId, articleId);
  const model = getCollection(articleCollection, articleSchema);

  const articleResponse = await model.findOne({ articleId: articleId });

  if (!articleResponse) {
    return null;
  }

  const article = articleResponse._doc;

  if (trackViewCount) {
    await model.findByIdAndUpdate(
      article._id, { ...article, views: (article.views || 0) + 1 },
      { new: true, upsert: true }
    );
  }

  // console.log(article);

  return toArticle(article);
};

export const updateArticleAvatar = async (id: string, file: any) => {
  const model = getCollection(articleCollection, articleSchema);
  const extension = file.originalname.substr(file.originalname.lastIndexOf("."));
  const filename = `${id}${extension}`;
  const fileurl = await processFileUpload("avatar", filename, file);
  const response = await model.findByIdAndUpdate(
    id, { profilePic: fileurl },
    { new: true, upsert: true }
  );
  return toArticle(response);
}

export const forgotPassword = async (email: string) => {
  const model = getCollection(articleCollection, articleSchema);
  const existingArticle = await model.find({ email: email.toLowerCase() })
  if (existingArticle.length > 0) {
    const article = existingArticle[0];
    const code = uuidv4();
    await updateCode(article._id, code);
    _sendRegistrationConfirmation(article.email, article.firstName, article.lastName, article.articleId, code);
    return true;
  }
  return false;
};

export const toArticle = (article: any) => {
  let { code, ...response }: any = { ...article }
  return response;
}