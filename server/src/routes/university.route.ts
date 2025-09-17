import expres from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  finialize,
  issueDocument,
} from "../controllers/university.controller.js";
import { upload } from "../lib/multer.js";
const router = expres.Router();

//Todo add checklogin middleware
router.post(
  "/issue",
  protect("university", "admin"),
  upload.single("pdf"),
  issueDocument
);

router.post("/finialize", protect("university", "admin"), finialize);

export default router;
