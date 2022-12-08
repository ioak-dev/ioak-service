import { asyncHandler } from "../../handler";
import { authorizeApi } from "../../middlewares";
import {
  addMember,
  updateMember,
  getMember,
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/member", asyncHandler(addMember));
  router.put("/member/:id", authorizeApi, asyncHandler(updateMember));
  router.get("/member", authorizeApi, asyncHandler(getMember));
};
