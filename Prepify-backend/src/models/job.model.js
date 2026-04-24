import mongoose, {Schema} from "mongoose";

const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    recruiterClerkID: {
      type: String,
      required: true,
      index: true,
    },
    candidatesApplied: {
      type: [String],
      default: [],
    },
    selectedCandidates: {
      type: [String],
      default: [],
    },
   open: {
    type: Boolean,
    default: true
   }
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
