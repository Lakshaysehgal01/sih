import express from "express";
import { verifyFromDB, verifyQr } from "../controllers/user.controller.js";
import { getUniversityByIssueId } from "../controllers/university.controller.js";
const router = express.Router();

//Todo this one is the db call one
router.get("/verify1", verifyFromDB);

//Qr code one
router.get("/verify/:hash", verifyQr);

router.get("/universities/:issuerId", getUniversityByIssueId);

export default router;
