import mongoose from "mongoose";

const tempRegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  universityName: { type: String, required: true },
  AISHE: { type: String, required: true },
  password: { type: String, required: true }, // Store unhashed temporarily
  letter: { type: String, required: true },
  publicAddress: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 900, // 15 minutes TTL
  },
});

export const TempRegistration = mongoose.model(
  "TempRegistration",
  tempRegistrationSchema
);
