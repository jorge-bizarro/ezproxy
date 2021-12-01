import { Router } from "express";
import { getInformation } from "../controller/student.controller.js";
import { verifyOriginMiddleware } from "../middleware/cors.middleware.js";

const router = Router();

router.get('/information', verifyOriginMiddleware(['https://www.google.com']), getInformation);

export default router;
