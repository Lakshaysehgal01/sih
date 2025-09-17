import express from "express";
import {
  addUniversity,
  getAllPendingUniversityRequests,
  removeUniversity,
  acceptUniversityRequest,
  rejectUniversityRequest,
} from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/getAllPendingRequests",
  protect("admin"),
  getAllPendingUniversityRequests
);

// Accept university request
router.post("/accept/:requestId", protect("admin"), acceptUniversityRequest);

// Reject university request
router.post("/reject/:requestId", protect("admin"), rejectUniversityRequest);

//Todo add admin middleware now
router.post("/addUniversity", protect("admin"), addUniversity);

router.post("/removeUniversity", protect("admin"), removeUniversity);

export default router;
