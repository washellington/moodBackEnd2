import * as express from "express";
import UserController from "../controllers/user.controller";
const router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", UserController.test);

router.put("/", UserController.create);
router.get("/:id", UserController.read);
router.post("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
