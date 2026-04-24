import { Router } from "express";
import { createJob, getAllJobs, applyToJob, selectCandidate} from "../controllers/job.controller.js";

const router = Router();

router.route("/all").get(getAllJobs);
router.route("/create").post(createJob);
router.route("/apply").post(applyToJob);
router.route("/select-candidate").post(selectCandidate);


export { router as jobRouter };
