import * as express from "express";
import AuthorizationController from "../controllers/authorization.controller";
import VerifyUserMiddleware from "../middleware/verify.user.middleware";
const router = express.Router();

router.post("/auth", [
  //VerifyUserMiddleware.hasAuthValidFields,
  VerifyUserMiddleware.isPasswordAndUserMatch,
  AuthorizationController.login
]);

export default router;
