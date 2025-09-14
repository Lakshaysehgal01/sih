import express from "express";
import { checkLogin } from "../middleware/auth.middleware.js";
import {
  addUniversity,
  removeUniversity,
} from "../controllers/admin.controller.js";

const router = express.Router();

//Todo add admin middleware now
router.post("/addUniversity", checkLogin, addUniversity);

router.post("/removeUniversity", checkLogin, removeUniversity);

export default router;
