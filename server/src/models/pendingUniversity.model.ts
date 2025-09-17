import { model, Schema } from "mongoose";

const pendingRequestSchema = new Schema(
  {
    universityName: {
      type: String,
      required: true,
    },
    AISHE: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    letter: {
      type: String,
      required: true,
    },
    publicAddress: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const pendingRequest = model("PendingRequest", pendingRequestSchema);
