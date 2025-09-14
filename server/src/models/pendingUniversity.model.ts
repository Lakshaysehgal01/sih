import { model, Schema } from "mongoose";


const requestSchema = new Schema(
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
    contactNumber:{
        type:Number,
        required:true,
        unique:true
    }
  },
  { timestamps: true }
);

export const Request = model("Request", requestSchema);
