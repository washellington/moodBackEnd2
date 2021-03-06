import * as express from "express";
import VerifyUserMiddleware from "../middleware/verify.user.middleware";
import UserController from "../controllers/user.controller";
const router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", UserController.test);

router.put("/", UserController.create);
router.post("/recover_account", UserController.recover_account);
router.put("/reset_password", UserController.reset_password);
router.get("/info", [VerifyUserMiddleware.validJWTNeeded, UserController.info]);
router.get("/:id", [VerifyUserMiddleware.validJWTNeeded, UserController.read]);
router.post("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
