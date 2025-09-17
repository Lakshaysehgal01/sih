//admin me username ,pass ,pending request ka array,email

import { model, Schema } from "mongoose";

const adminSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pendingRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Request",
    },
  ],
});

export const Admin = model("Admin", adminSchema);
