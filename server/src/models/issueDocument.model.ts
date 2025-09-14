import { model, Schema } from "mongoose";

const documentsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    enrollNo: {
      type: String,
      required: true,
      unique: true,
    },
    course: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["pdf", "png", "jpg"],
      default: "pdf",
    },
    OrLink: {
      type: String,
      default: "",
    },
    issued: {
      type: Boolean,
      default: false,
    },
    issuedBy: {
      type: Schema.Types.ObjectId,
      ref: "University",
    },
  },
  { timestamps: true }
);

export const Documents = model("Documents", documentsSchema);
