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

export const addArticle = async (data: any) => {
  const model = getCollection(articleCollection, articleSchema);
  if (data._id) {
    return await model.findByIdAndUpdate(
      data._id, { title: data.title, description: data.description, tags: data.tags },
      { new: true, upsert: true }
    );
  }
  return await model.create({
    ...data,
    views: 0,
    likes: 0,
  });
};

export const updateArticle = async (articleId: string, data: any) => {
  const model = getCollection(articleCollection, articleSchema);
  const response = await model.findByIdAndUpdate(
    articleId, { title: data.title, description: data.description, tags: data.tags },
    { new: true, upsert: true }
  );
  return response;
};

export const getArticle = async () => {
  const model = getCollection(articleCollection, articleSchema);

  return await model.find();
};

export const getArticleById = async (id: string) => {
  const model = getCollection(articleCollection, articleSchema);

  return await model.findOne({ _id: id });
};
