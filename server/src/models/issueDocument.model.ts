import { model, Schema } from "mongoose";
import { is } from "zod/locales";

const documentsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    enrollNo: {
      type: String,
      required: true,
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
    QrLink: {
      type: String,
      default: "",
    },
    certHash: {
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

documentsSchema.index({ issuedBy: 1 });

export const Documents = model("Documents", documentsSchema);
