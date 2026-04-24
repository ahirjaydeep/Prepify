import mongoose, { Schema } from "mongoose";

const interviewSchema = new Schema(
  {
    candidate: {
      type: String,
      required: true,
      index: true,
    },
    resume: {
      type: String,
      required: true,
    },
    transcript: {
      type: [String],
      default: [],
    },
    // Optional references for future job-board integration
    candidateId: {
      type: String,
      index: true,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
    },
  },
  { timestamps: true }
);

export const Interview = mongoose.model("Interview", interviewSchema);
