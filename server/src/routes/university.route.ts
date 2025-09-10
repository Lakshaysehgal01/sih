import expres from "express";
import { checkLogin } from "../middleware/auth.middleware.js";

import { finialize, issueDocument } from "../controllers/university.controller.js";
import { upload } from "../lib/multer.js";
const router = expres.Router();

router.post("/issue", checkLogin, upload.single("pdf"), issueDocument);

router.post("/finialize",checkLogin,finialize);

export default router;
