import express from "express";
import { verifyFromDB, verifyQr } from "../controllers/user.controller.js";
const router = express.Router();

//Todo this one is the db call one
router.post("/verify1", verifyFromDB);

//Qr code one
router.post("/verify/:hash", verifyQr);

export default router;
