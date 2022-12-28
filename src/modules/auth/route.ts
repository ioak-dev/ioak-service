import { asyncHandler } from "../../handler";
import { authorizeApi } from "../../middlewares";
import {
  signin, changepassword, otrs
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/auth/signin", asyncHandler(signin));
  router.post("/otrs", asyncHandler(otrs));
  router.post("/otrs/ticket/_doc/:ticketId", asyncHandler(otrs));
  router.post("/auth/changepassword", authorizeApi, asyncHandler(changepassword));
};
