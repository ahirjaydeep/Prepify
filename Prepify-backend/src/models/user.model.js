import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    clerkID: {
      type: String, // Clerk's unique ID
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["recruiter", "candidate"],
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
