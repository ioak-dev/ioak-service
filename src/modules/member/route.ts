const multer = require("multer");
var upload = multer();
import { asyncHandler } from "../../handler";
import { authorizeApi } from "../../middlewares";
import {
  addMember,
  uploadMemberAvatar,
  updateMember,
  getMember,
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/member", asyncHandler(addMember));
  // router.post("/member/:id/avatar", authorizeApi, asyncHandler(uploadMemberAvatar));
  router.post("/member/:id/avatar", upload.single("file"), authorizeApi, asyncHandler(uploadMemberAvatar));
  router.put("/member/:id", authorizeApi, asyncHandler(updateMember));
  router.get("/member", asyncHandler(getMember));
};
