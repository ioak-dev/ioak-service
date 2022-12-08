import { getSystemUsers } from "./service";

module.exports = function (router: any) {
  router.get("/user/system", getSystemUsers);
};
