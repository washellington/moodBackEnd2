import * as express from "express";
import MentalStateController from "../controllers/mental_state.controller";
import VerifyUserMiddleware from "../middleware/verify.user.middleware";
const router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", MentalStateController.test);

router.put("/", MentalStateController.create);
router.get("/recent", [
  VerifyUserMiddleware.validJWTNeeded,
  MentalStateController.recent
]);
router.get("/overview", [
  VerifyUserMiddleware.validJWTNeeded,
  MentalStateController.overviewInformation
]);
router.get("/:id", MentalStateController.read);
router.post("/:id", MentalStateController.update);
router.delete("/:id", MentalStateController.delete);

export default router;
