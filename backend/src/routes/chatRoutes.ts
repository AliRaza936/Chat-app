import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import { getChats, getOrCreateChat } from "../controllers/chatController.ts";


const router = Router()
router.get('/',protectRoute,getChats)
router.post('/with/:participantId',protectRoute,getOrCreateChat)
export default router