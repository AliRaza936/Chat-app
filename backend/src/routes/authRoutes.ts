import { Router } from "express";
import { authCallback, getMe } from "../controllers/authController.ts";
import { protectRoute } from "../middleware/auth.ts";


const router = Router()

router.get("/me",protectRoute,getMe)
router.post("/callback",authCallback)

export default router