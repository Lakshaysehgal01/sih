import express from "express";
import {
  login,
  logout,
  signup,
  universitySignUp,
  verifyUniversityOTP,
} from "../controllers/auth.controller.js";
import { upload } from "../lib/multer.js";
import authenticate from "../middleware/authenticate.middleware.js";

const router = express.Router();

router.post("/universitySignUp", upload.single("letter"), universitySignUp);

router.post("/verify-university-otp", verifyUniversityOTP);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/api/me", authenticate, (req, res) => {
  res.json({ user: req.authUser });
});

export default router;
