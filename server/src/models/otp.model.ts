import { model, Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // auto delete after 10 min
    },
  },
  { timestamps: true }
);

// Add compound index to prevent duplicate OTPs for same email
otpSchema.index({ email: 1, otp: 1 }, { unique: true });

otpSchema.index({ email: 1 });

export const Otp = model("Otp", otpSchema);
