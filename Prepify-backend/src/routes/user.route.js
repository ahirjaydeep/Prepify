import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  storeUserDetails,
  uploadResume,
  updateResume,
  getUserResume,
} from "../controllers/user.controller.js";

const router = Router();

// POST /api/v1/user/store — store user on first Clerk sign-in
router.route("/store").post(storeUserDetails);

// POST /api/v1/user/upload-resume — upload a new resume
router.route("/upload-resume").post(upload.single("resume"), uploadResume);

// POST /api/v1/user/update-resume — update existing resume
router.route("/update-resume").post(upload.single("resume"), updateResume);

// POST /api/v1/user/resume — get a user's stored resume
router.route("/resume").post(getUserResume);

export { router as userRouter };
