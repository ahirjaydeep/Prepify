import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { startInterview, continueInterview, getJobInterviews, getCandidateInterviews } from "../controllers/interview.controller.js";

const router = Router();

router.route("/start-interview").post(upload.single("file"), startInterview);
router.route("/continue-interview").post(continueInterview);
router.route("/by-job").post(getJobInterviews);
router.route("/by-candidate").post(getCandidateInterviews);

export { router };