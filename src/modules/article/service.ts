import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const addArticle = async (req: any, res: any) => {
  const userId = req.user.id;
  const article: any = await Helper.addArticle(req.body, userId);
  res.status(200);
  res.send(article);
  res.end();
};

export const updateArticle = async (req: any, res: any) => {
  const userId = req.user.id;
  const article: any = await Helper.updateArticle(req.params.id, req.body, userId);
  res.status(200);
  res.send(article);
  res.end();
};

export const getArticle = async (req: any, res: any) => {
  const userId = req.userId;
  console.log(userId);
  const articleList: any = await Helper.getArticle();
  res.status(200);
  res.send(articleList);
  res.end();
};

export const getArticleById = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const article: any = await Helper.getArticleById(req.params.id);
  res.status(200);
  res.send(article);
  res.end();
};
