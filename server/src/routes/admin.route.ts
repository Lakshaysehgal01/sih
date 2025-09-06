import express from "express";
import { checkAdimn, checkLogin } from "../middleware/auth.middleware.js";
import { addUniversity, removeUniversity } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/addUniversity", checkLogin, checkAdimn, addUniversity);

router.post("/removeUniversity", checkLogin, checkAdimn, removeUniversity);

export default router;
