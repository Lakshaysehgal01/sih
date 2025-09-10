import expres from "express";
import { checkLogin } from "../middleware/auth.middleware.js";

import { finialize, issueDocument } from "../controllers/university.controller.js";
import { upload } from "../lib/multer.js";
const router = expres.Router();

//Todo add checklogin middleware
router.post("/issue", upload.single("pdf"), issueDocument);

router.post("/finialize",finialize);

export default router;
