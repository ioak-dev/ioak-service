import bcrypt from "bcrypt";
import { validateMandatoryFields } from "../../lib/validation";

import * as Helper from "./helper";
import { getCollection } from "../../lib/dbutils";

const selfRealm = 100;

export const addArticle = async (req: any, res: any) => {
  const article: any = await Helper.addArticle(req.body);
  if (article === "EMAIL_EXISTS") {
    res.status(409);
    res.end();
    return;
  }
  res.status(200);
  res.send(article);
  res.end();
};

export const updateArticle = async (req: any, res: any) => {
  const id = req.user.id;
  const articleId = req.user.articleId;
  if (req.params.id !== id) {
    res.status(401);
    res.end();
  } else {
    const article: any = await Helper.updateArticle(req.params.id, req.body);
    res.status(200);
    res.send(article);
    res.end();
  }
};

export const getArticle = async (req: any, res: any) => {
  const userId = req.userId;
  console.log(userId);
  const articleList: any = await Helper.getArticle();
  res.status(200);
  res.send(articleList);
  res.end();
};

export const uploadArticleAvatar = async (req: any, res: any) => {
  const id = req.user.id;
  const articleId = req.user.articleId;
  if (req.params.id !== id) {
    res.status(401);
    res.end();
  } else {
    const response: any = await Helper.updateArticleAvatar(req.params.id, req.file);
    res.status(200);
    res.send(response);
    res.end();
  }
};

export const getArticleById = async (req: any, res: any) => {
  const userId = req.user.user_id;
  const article: any = await Helper.getArticleById(req.params.id);
  res.status(200);
  res.send(article);
  res.end();
};


export const getArticleById = async (req: any, res: any) => {
  const userId = req.userId;
  const article: any = await Helper.getArticleById(req.params.articleid, userId, true);
  console.log(article);
  if (!article) {
    res.status(404);
    res.end();
    return;
  }
  res.status(200);
  res.send(article);
  res.end();
};


export const getArticleByIdForEdit = async (req: any, res: any) => {
  const article: any = await Helper.getArticleById(req.params.articleid, null, false);
  if (!article) {
    res.status(404);
    res.end();
    return;
  }
  res.status(200);
  res.send(article);
  res.end();
};

export const forgotPassword = async (req: any, res: any) => {
  const article: any = await Helper.forgotPassword(req.body.email);
  if (!article) {
    res.status(404);
    res.end();
    return;
  }
  res.status(200);
  res.end();
};
