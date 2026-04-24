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



export { router as userRouter };
