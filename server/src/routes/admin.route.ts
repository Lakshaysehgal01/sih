import express from "express";
import { checkAdmin, checkLogin } from "../middleware/auth.middleware.js";
import { addUniversity, removeUniversity } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/addUniversity", checkLogin, checkAdmin, addUniversity);

router.post("/removeUniversity", checkLogin, checkAdmin, removeUniversity);

export default router;
