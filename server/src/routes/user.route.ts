import express from "express";
import { verifyFromDB, verifyQr } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { getUniversityByIssueId } from "../controllers/university.controller.js";
const router = express.Router();

//Todo this one is the db call one
router.get("/verify1", protect(), verifyFromDB);

//Qr code one
router.get("/verify/:hash", protect(), verifyQr);

router.get("/universities/:issuerId", getUniversityByIssueId);

export default router;
