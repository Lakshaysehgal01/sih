//array that stores objectUd of issued documents
//see chatgpt aicte no and all

import { model, Schema } from "mongoose";

const universitySchema = new Schema({
  universityName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  AISHE: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  publicAddress: {
    type: String,
    required: true,
    unique: true,
  },
  letter: {
    type: String,
    required: true,
  },
  issuedDocuments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Documents",
    },
  ],
});

export const University = model("University", universitySchema);
