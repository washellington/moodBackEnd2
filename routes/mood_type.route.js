import * as express from "express";
import MoodTypeController from "../controllers/mood_type.controller";
const router = express.Router();

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", MoodTypeController.test);

router.get("/", MoodTypeController.index);

export default router;
