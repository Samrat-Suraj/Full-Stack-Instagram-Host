import express from "express"
import upload from "../utils/multer.js"
import { protectRoute } from "../Middleware/ProtectRoute.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../Controller/PostControllers.js";
const router = express.Router()


router.post("/addpost", protectRoute, upload.single("image"),addNewPost);
router.get("/all", protectRoute, getAllPost);
router.get("/userpost/all", protectRoute, getUserPost);
router.get("/:id/like", protectRoute, likePost);
router.get("/:id/dislike", protectRoute, dislikePost);
router.post("/:id/comment", protectRoute, addComment);
router.get("/:id/comment/all", protectRoute, getCommentsOfPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id/bookmark", protectRoute, bookmarkPost);


export default router