import { Router } from "express";
import { createJob, getAllJobs, applyToJob, selectCandidate, closeJob, getUserJobs, getUserAppliedJob } from "../controllers/job.controller.js";

const router = Router();

router.route("/all").get(getAllJobs);
router.route("/create").post(createJob);
router.route("/apply").post(applyToJob);
router.route("/select-candidate").post(selectCandidate);
router.route("/close").post(closeJob);
router.route("/recruiter-jobs").post(getUserJobs);
router.route("/applied-jobs").post(getUserAppliedJob);

export { router as jobRouter };
