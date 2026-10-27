import { Router } from "express";

import { getMediaByCategory } from "../controllers/media.controller.js";

const router = Router();

router.get("/category/:category", getMediaByCategory);

export default router;
