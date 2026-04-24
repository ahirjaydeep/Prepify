import { asyncHandeler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Job } from "../models/job.model.js";

const createJob = asyncHandeler(async (req, res) => {
  const { jobTitle, jobDescription, recruiterClerkID } = req.body;
  if (!jobTitle || !jobDescription || !recruiterClerkID)
    throw new ApiError(400, "jobTitle, jobDescription, and recruiterClerkID are required");

  const createdJob = await Job.create({ jobTitle, jobDescription, recruiterClerkID });
  return res.status(201).json(new ApiResponse(201, createdJob, "Job created successfully"));
});

const getAllJobs = asyncHandeler(async (req, res) => {
  const jobs = await Job.find({ open: true }).sort({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, jobs, "Open jobs retrieved successfully"));
});

const applyToJob = asyncHandeler(async (req, res) => {
  const { clerkID, jobId } = req.body;
  if (!clerkID) throw new ApiError(400, "clerkID is required");
  if (!jobId) throw new ApiError(400, "jobId is required");

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $addToSet: { candidatesApplied: clerkID } },
    { new: true }
  );
  if (!updatedJob) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, updatedJob, "Applied for job successfully"));
});

const selectCandidate = asyncHandeler(async (req, res) => {
  const { clerkID, jobId } = req.body;
  if (!clerkID) throw new ApiError(400, "clerkID is required");
  if (!jobId) throw new ApiError(400, "jobId is required");

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $addToSet: { selectedCandidates: clerkID } },
    { new: true }
  );
  if (!updatedJob) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, updatedJob, "Candidate selected successfully"));
});

const closeJob = asyncHandeler(async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) throw new ApiError(400, "jobId is required");

  const closedJob = await Job.findByIdAndUpdate(jobId, { $set: { open: false } }, { new: true });
  if (!closedJob) throw new ApiError(404, "Job not found");
  return res.status(200).json(new ApiResponse(200, closedJob, "Job closed successfully"));
});

const getUserJobs = asyncHandeler(async (req, res) => {
  const { recruiterClerkID } = req.body;
  if (!recruiterClerkID) throw new ApiError(400, "recruiterClerkID is required");

  const userJobs = await Job.find({ recruiterClerkID }).sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(200, userJobs, userJobs.length === 0 ? "No jobs created yet" : "Jobs retrieved successfully")
  );
});

const getUserAppliedJob = asyncHandeler(async (req, res) => {
  const { clerkID } = req.body;
  if (!clerkID) throw new ApiError(400, "clerkID is required");

  const appliedJobs = await Job.find({ candidatesApplied: clerkID });
  return res.status(200).json(
    new ApiResponse(200, appliedJobs, appliedJobs.length === 0 ? "No applied jobs yet" : "Applied jobs retrieved")
  );
});

export { createJob, getAllJobs, applyToJob, selectCandidate, closeJob, getUserAppliedJob, getUserJobs };