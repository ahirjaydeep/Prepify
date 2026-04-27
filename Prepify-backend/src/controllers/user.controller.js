import { asyncHandeler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mammoth from "mammoth";
import { Resume } from "../models/resume.model.js";
import fs from "fs/promises";

/**
 * Extracts plain text from a .docx file.
 */
const extractDocx = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new ApiError(500, "Error while extracting text from resume");
  }
};

/**
 * POST /api/v1/user/store
 * Stores user details on first Clerk sign-in (upsert-style).
 */
const storeUserDetails = asyncHandeler(async (req, res) => {
  const { clerkID, role } = req.body;

  if (!clerkID || !role) {
    throw new ApiError(400, "clerkID and role are required");
  }

  // Return existing user if already stored
  const existingUser = await User.findOne({ clerkID });
  if (existingUser) {
    return res
      .status(200)
      .json(new ApiResponse(200, existingUser, "User already exists"));
  }

  const storedUser = await User.create({ clerkID, role });

  return res
    .status(201)
    .json(new ApiResponse(201, storedUser, "User details stored successfully"));
});

/**
 * POST /api/v1/user/upload-resume
 * Uploads and stores a candidate's resume text.
 * Expects: multipart/form-data with field name "resume"
 */
const uploadResume = asyncHandeler(async (req, res) => {
  const { clerkID } = req.body;
  if (!clerkID) throw new ApiError(400, "clerkID is required");

  // FIX: was using req.files?.resumeLocalPath — multer.single() puts file in req.file
  const resumeLocalPath = req.file?.path;
  if (!resumeLocalPath) throw new ApiError(400, "Resume file not found");

  const resumetext = await extractDocx(resumeLocalPath);
  await fs.unlink(resumeLocalPath).catch(() => {});

  const storedResume = await Resume.create({
    candidateId: clerkID,
    resumetext,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, storedResume, "Resume uploaded successfully"));
});

/**
 * POST /api/v1/user/update-resume
 * Updates an existing candidate's resume text.
 * Expects: multipart/form-data with field name "resume"
 */
const updateResume = asyncHandeler(async (req, res) => {
  const { clerkID } = req.body;
  if (!clerkID) throw new ApiError(400, "clerkID is required");

  // FIX: same as uploadResume — use req.file
  const resumeLocalPath = req.file?.path;
  if (!resumeLocalPath) throw new ApiError(400, "Resume file not found");

  const resumetext = await extractDocx(resumeLocalPath);
  await fs.unlink(resumeLocalPath).catch(() => {});

  const updatedResume = await Resume.findOneAndUpdate(
    { candidateId: clerkID },
    { $set: { resumetext } },
    { new: true }
  );

  if (!updatedResume) {
    throw new ApiError(404, "Resume not found for this user. Upload one first.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedResume, "Resume updated successfully"));
});

/**
 * POST /api/v1/user/resume
 * Returns a candidate's stored resume.
 */
const getUserResume = asyncHandeler(async (req, res) => {
  const { clerkID } = req.body;

  if (!clerkID) {
    throw new ApiError(400, "clerkID is required");
  }

  const resume = await Resume.findOne({ candidateId: clerkID });

  if (!resume) {
    throw new ApiError(404, "Resume not found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume retrieved successfully"));
});

export { storeUserDetails, uploadResume, updateResume, getUserResume };
