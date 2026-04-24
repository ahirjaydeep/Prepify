import mongoose, {Schema} from "mongoose";

const resumeSchema = new Schema(
  {
    candidateId: {
      type: String,
      required: true,
      index: true,
    },
   resumetext:{
    type:String,
    required: true,
   }
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
