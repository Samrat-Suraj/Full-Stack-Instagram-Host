
export const USER_API_ENDPOINT  = "https://insta-uy4u.onrender.com/api/v1/user"
export const POST_API_ENDPOINT  = "https://insta-uy4u.onrender.com/api/v1/post"
export const MESSAGE_API_ENDPOINT  = "https://insta-uy4u.onrender.com/api/v1/message"


// User :---- 

// http://localhost:3000/api/v1/user/register
// http://localhost:3000/api/v1/user/login
// http://localhost:3000/api/v1/user/logout

// http://localhost:3000/api/v1/user/:id/profile
// http://localhost:3000/api/v1/user/profile/edit
// http://localhost:3000/api/v1/user/suggested
// http://localhost:3000/api/v1/user/followorunfollow/:id
// http://localhost:5000/api/v1/user/getuserbyquery?keyword=suraj

// Post : - 

// router.post("/addpost", protectRoute, upload.single("image"),addNewPost);
// router.get("/all", protectRoute, getAllPost);
// router.get("/userpost/all", protectRoute, getUserPost);
// router.get("/:id/like", protectRoute, likePost);
// router.get("/:id/dislike", protectRoute, dislikePost);
// router.post("/:id/comment", protectRoute, addComment);
// router.get("/:id/comment/all", protectRoute, getCommentsOfPost);
// router.delete("/delete/:id", protectRoute, deletePost);
// router.get("/:id/bookmark", protectRoute, bookmarkPost);


// Message :--- 

// router.post("/send/:id" ,protectRoute, sendMessage)
// router.get('/all/:id',protectRoute,getMessage);