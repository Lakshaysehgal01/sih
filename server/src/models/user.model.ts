import { Schema, type InferSchemaType, Document, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

export type userDocumnet = InferSchemaType<typeof userSchema> & Document;

export const User = model("User", userSchema);
