import { Interview } from "../models/interview.model.js";
import { Job } from "../models/job.model.js";
import { asyncHandeler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mammoth from "mammoth";
import fs from "fs/promises";
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const Interviewer = async (candidate, resumeText, transcriptText, jobTitle = null, jobDescription = null) => {
  const jobContext = jobTitle
    ? `\nJOB TITLE: ${jobTitle}\nJOB DESCRIPTION:\n${jobDescription}\n\nTailor ALL questions to skills, experience, and responsibilities relevant to this specific role.`
    : "";

  const prompt = `You are "Prepify", a professional AI interviewer conducting a one-on-one mock interview. Ask one question at a time.

Rules:
1. If no transcript yet: greet the candidate by name, explain the format briefly, then ask the first warm-up question.
2. If transcript exists: read the last response carefully, then ask an appropriate follow-up or next question.
3. Do NOT evaluate or summarize during the interview — just continue naturally.
4. Ask a mix of technical, behavioral, and problem-solving questions based on the resume.
5. Keep each response to ONE clear question.
6. If the candidate asks to end the interview, give detailed areas to improve.
${jobContext}

CANDIDATE NAME: ${candidate}

RESUME:
${resumeText}

TRANSCRIPT SO FAR:
${transcriptText || "(No responses yet — this is the opening of the interview)"}

Your creator name is Jaydeep Ahir
When user asks for the name of creator, answer Jaydeep Ahir for HireMind. For the underlying LLM, say Groq.

Note: You are the HireMind AI interviewer, created by Jaydeep Ahir. Underlying LLM is Groq.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    });
    return chatCompletion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error("Groq API error:", error.message);
    if (error.status === 429) {
      return "Too many requests right now — please try again in a moment.";
    }
    return null;
  }
};

const extractDocx = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

/** POST /api/v1/interview/start-interview */
const startInterview = asyncHandeler(async (req, res) => {
  const { candidate, jobId, candidateId } = req.body;

  if (!candidate?.trim()) throw new ApiError(400, "Candidate name is required");

  const resumeLocalPath = req.file?.path;
  if (!resumeLocalPath) throw new ApiError(400, "Resume file is missing");

  const resume = await extractDocx(resumeLocalPath);
  if (!resume?.trim()) throw new ApiError(422, "Failed to extract text from resume");

  await fs.unlink(resumeLocalPath).catch(() => { });

  // If jobId provided, load job for context
  let jobTitle = null;
  let jobDescription = null;
  if (jobId) {
    const job = await Job.findById(jobId);
    if (job) {
      jobTitle = job.jobTitle;
      jobDescription = job.jobDescription;
    }
  }

  const startedInterview = await Interview.create({
    candidate: candidate.trim(),
    resume,
    transcript: [],
    ...(candidateId && { candidateId }),
    ...(jobId && { jobId }),
  });

  const aiResponse = await Interviewer(candidate.trim(), resume, "", jobTitle, jobDescription);
  const aiMessage =
    (typeof aiResponse === "string" ? aiResponse : null) ||
    `Hello ${candidate}! Welcome to your HireMind mock interview. Let's start — could you briefly introduce yourself?`;

  startedInterview.transcript.push(`Interviewer: ${aiMessage}`);
  await startedInterview.save();

  return res.status(201).json(
    new ApiResponse(201, { interviewId: startedInterview._id, candidate: startedInterview.candidate, aiMessage }, "Interview started successfully")
  );
});

/** POST /api/v1/interview/continue-interview */
const continueInterview = asyncHandeler(async (req, res) => {
  const { interviewId, userMessage } = req.body;
  if (!interviewId || !userMessage) throw new ApiError(400, "Missing interviewId or userMessage");

  const interview = await Interview.findById(interviewId);
  if (!interview) throw new ApiError(404, "Interview session not found");

  interview.transcript.push(`Candidate: ${userMessage}`);

  // Load job context if interview is job-linked
  let jobTitle = null;
  let jobDescription = null;
  if (interview.jobId) {
    const job = await Job.findById(interview.jobId);
    if (job) { jobTitle = job.jobTitle; jobDescription = job.jobDescription; }
  }

  const aiResponse = await Interviewer(
    interview.candidate,
    interview.resume,
    interview.transcript.join("\n"),
    jobTitle,
    jobDescription
  );

  const aiMessage =
    (typeof aiResponse === "string" ? aiResponse : null) ||
    "I'm sorry, I couldn't generate a response. Please try again.";

  interview.transcript.push(`Interviewer: ${aiMessage}`);
  await interview.save();

  return res.status(200).json(
    new ApiResponse(200, { aiMessage, transcript: interview.transcript, interviewId: interview._id }, "Interview continued")
  );
});

/** POST /api/v1/interview/by-job — recruiter views all interviews for a job */
const getJobInterviews = asyncHandeler(async (req, res) => {
  const { jobId } = req.body;
  if (!jobId) throw new ApiError(400, "jobId is required");

  const interviews = await Interview.find({ jobId })
    .select("candidate candidateId transcript createdAt")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, interviews, "Job interviews retrieved"));
});

/** POST /api/v1/interview/by-candidate — candidate's own interview history */
const getCandidateInterviews = asyncHandeler(async (req, res) => {
  const { candidateId } = req.body;
  if (!candidateId) throw new ApiError(400, "candidateId is required");

  const interviews = await Interview.find({ candidateId })
    .select("candidate jobId createdAt transcript")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, interviews, "Candidate interviews retrieved"));
});

export { startInterview, continueInterview, getJobInterviews, getCandidateInterviews };
