import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  // finialize,
  finializeMultiple,
  getUniversityDetails,
  // issueDocument,
  issueManyDocuments,
} from "../controllers/university.controller.js";
import { upload } from "../lib/multer.js";
const router = express.Router();

// router.post(
//   "/issue",
//   protect("university", "admin"),
//   upload.single("pdf"),
//   issueDocument
// );

// router.post("/finialize", protect("university", "admin"), finialize);

router.post(
  "/issueMany",
  protect("university", "admin"),
  upload.array("pdf", 20),
  issueManyDocuments
);

router.post(
  "/finializeMany",
  protect("university", "admin"),
  finializeMultiple
);

router.get("/getDetails", protect("university", "admin"), getUniversityDetails);

export default router;
