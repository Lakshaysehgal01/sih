import express from "express";
import { protect } from "../middleware/auth.middleware.js";

import {
  finializeMultiple,
  getAllIssuedDocuments,
  getUniversityDetails,
  issueManyDocuments,
} from "../controllers/university.controller.js";
import { upload } from "../lib/multer.js";
const router = express.Router();

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

router.get(
  "/getAllIssuedDocuments",
  protect("university", "admin"),
  getAllIssuedDocuments
);

export default router;
