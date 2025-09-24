import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDb } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import publicRoutes from "./routes/user.route.js";
import universityRoutes from "./routes/university.route.js";
dotenv.config({ quiet: true });

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://verify-v1.netlify.app"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/user", userRoutes);
app.use("/api/v1/public", publicRoutes);
app.use("/api/v1/university", universityRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  connectToDb();
});
