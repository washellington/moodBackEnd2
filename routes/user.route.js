import * as express from "express";
import UserController from "../controllers/user.controller";
const router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", UserController.test);

router.post("/create", UserController.create);
// router.get("/read", UserController.read);
// router.post("/update", UserController.update);
// router.delete("/delete", UserController.delete);

export default router;
