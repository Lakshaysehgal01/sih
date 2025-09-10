import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.ClOUDINARY_CLOUD_NAME,
  api_key: process.env.ClOUDINARY_API_KEY,
  api_secret: process.env.ClOUDINARY_API_SECERT,
});

export default cloudinary;
