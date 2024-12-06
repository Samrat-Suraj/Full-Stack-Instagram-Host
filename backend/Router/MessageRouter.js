import express from "express"
import { getMessage, sendMessage } from "../Controller/MessageController.js";
import { protectRoute } from "../Middleware/ProtectRoute.js";
const router = express.Router()

router.post("/send/:id" ,protectRoute, sendMessage)
router.get('/all/:id',protectRoute,getMessage);

export default router;