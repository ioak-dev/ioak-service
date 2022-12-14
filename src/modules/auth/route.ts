import { asyncHandler } from "../../handler";
import { authorizeApi } from "../../middlewares";
import {
  signin
} from "./service";

const selfRealm = 100;

module.exports = function (router: any) {
  router.post("/auth/signin", asyncHandler(signin));
};
