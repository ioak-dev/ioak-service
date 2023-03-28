const multer = require("multer");
var upload = multer();
import { asyncHandler } from "../../handler";
import { authorizeApi, authorizeApiRead } from "../../middlewares";
import {
  uploadImage,
  uploadImageWriteup
  // deleteArticleById
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/upload", upload.single("file"), asyncHandler(uploadImage));
  router.post("/upload/writeup", upload.single("file"), asyncHandler(uploadImageWriteup));
};
