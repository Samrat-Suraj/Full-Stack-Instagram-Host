import express from "express";
import { editProfile, followOrUnfollow, GetAllUser, getProfile, getSuggestedUsers, GetUserByQuery, login, logout, Register } from "../Controller/UserControllers.js";
import { protectRoute } from "../Middleware/ProtectRoute.js";
import upload from "../utils/multer.js";
const router = express.Router()


router.post("/register" , Register)
router.post("/login" , login)
router.post("/logout" , logout)

router.get('/getuserbyquery', protectRoute, GetUserByQuery);
router.get('/getall', protectRoute, GetAllUser);
router.get('/:id/profile',protectRoute, getProfile);
router.post('/profile/edit' , protectRoute, upload.single("profilePicture"), editProfile);
router.get('/suggested',protectRoute, getSuggestedUsers);
router.post('/followorunfollow/:id', protectRoute ,followOrUnfollow);

export default router