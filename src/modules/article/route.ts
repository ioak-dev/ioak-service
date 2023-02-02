const multer = require("multer");
var upload = multer();
import { asyncHandler } from "../../handler";
import { authorizeApi, authorizeApiRead } from "../../middlewares";
import {
  addArticle,
  updateArticle,
  getArticle,
  getArticleById,
  // deleteArticleById
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/article", authorizeApi, asyncHandler(addArticle));
  router.put("/article/:id", authorizeApi, asyncHandler(updateArticle));
  router.get("/article", authorizeApi, asyncHandler(getArticle));
  router.get("/article/:id", authorizeApi, asyncHandler(getArticleById));
  // router.delete("/article/:id", authorizeApi, asyncHandler(deleteArticleById));
};
