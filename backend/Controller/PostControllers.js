import { Comment } from "../Model/CommentModel.js"
import { Post } from "../Model/PostModel.js"
import { User } from "../Model/UserModel.js"
import { getReceiverSocketId, io } from "../socket/socket.js"
import cloudinary from "../utils/cloudinary.js"
import DataUri from "../utils/DataUri.js"

export const addNewPost = async (req, res) => {
    try {
        const userId = req.user.id
        const { caption } = req.body
        const image = req.file

        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "user not found", success: false })
        }

        const fileUri = DataUri(image)
        const uploadResponse = await cloudinary.uploader.upload(fileUri)


        const newPost = new Post({
            caption,
            image: uploadResponse.secure_url,
            author: user,
        })

        await newPost.save();
        await User.findByIdAndUpdate(user._id, { $push: { posts: newPost._id } })
        return res.status(200).json({ message: "Post upload successfully", success: true, post: newPost })

    } catch (error) {
        console.log("Error in addNewPost controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({ path: "comment", sort: { createdAt: -1 }, populate: { path: "author", select: "username profilePicture" } })

        if (!posts) {
            return res.status(400).json({ message: "post not found", success: false })
        }

        res.status(200).json({ posts, success: true })
    } catch (error) {
        console.log("Error in getAllPost controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}

export const getUserPost = async (req, res) => {
    try {
        const userId = req.user.id

        const posts = await Post.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({ path: "comment", sort: { createdAt: -1 }, populate: { path: "author", select: "username profilePicture" } })

        if (!posts) {
            return res.status(400).json({ message: "post not found", success: false })
        }

        res.status(200).json({ posts, success: true })
    } catch (error) {
        console.log("Error in getUserPost controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}

export const likePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user.id

        const user = await User.findById(userId).populate("username profilePicture")

        // .populate("username , profilePicture")

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found", success: false })
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "Post already liked by this user", success: false });
        }


        await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } })


        const postOwnerId = post.author.toString()
        if (postOwnerId !== userId) {
            const notifation = {
                type: "like",
                userId: userId,
                userDetails: user,
                postId,
                post,
                message: "Your Post Was Liked"
            }

            const postOwnerSockitId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSockitId).emit("notifation", notifation)
        }

        return res.status(200).json({ message: "Post liked successfully", success: true });
    } catch (error) {
        console.log("Error in likePost controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}

export const dislikePost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user.id

        const user = await User.findById(userId).populate("username profilePicture")

        // .populate("username , profilePicture")

        if (!user) {
            return res.status(400).json({ message: "user not found", success: false })
        }
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({ message: "post not found", success: false })
        }

        await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } })

        const postOwnerId = post.author.toString()
        if (postOwnerId !== userId) {
            const notifation = {
                type: "Dislike",
                userId: userId,
                userDetails: user,
                postId,
                message: "Your Post Was DisLiked"
            }

            const postOwnerSockitId = getReceiverSocketId(postOwnerId)
            io.to(postOwnerSockitId).emit("notifation", notifation)
        }

        return res.status(200).json({ message: "Post unliked successfully", success: true });
    } catch (error) {
        console.log("Error in likePost controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user.id
        const { text } = req.body

        if (!text) {
            return res.status(400).json({ message: "text is required for comment", success: false });
        }

        const user = await User.findById(userId).select("-password")
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(400).json({ message: "Post not found", success: false });
        }

        const newComment = new Comment({
            text,
            author: user,
            post: post
        })

        await newComment.populate({
            path: 'author',
            select: "username profilePicture"
        });

        await newComment.save()
        await Post.findByIdAndUpdate(postId, { $push: { comment: newComment._id } })
        return res.status(201).json({ message: "Commented successfully", comment: newComment, success: true });

    } catch (error) {
        console.log("Error in addComment controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id
        const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 }).populate({ path: "author", select: "username profilePicture" })
            .populate({ path: "post" })

        if (comments.length == 0) {
            res.status(500).json({ message: "No comment found", success: true })
        }
        console.log(comments)
        // const comment = await Post.findById(postId).populate({path : "comment" , select : "author text" , populate :{path : "author" , select : "username profilePicture"}})
        res.status(200).json({ comments, success: true })
    } catch (error) {
        console.log("Error in getCommentsOfPost controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}

export const deletePost = async (req, res) => {
    try {
        const userId = req.user.id
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: "post not found", success: false })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "post not found", success: false })
        }

        if (user._id.toString() !== post.author._id.toString()) {
            return res.status(400).json({ message: "you are the not author of this post", success: false })
        }

        if (post.image) {
            const oldPublicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(oldPublicId);
        }

        await Post.findByIdAndDelete(post._id)
        await User.findByIdAndUpdate(user._id, { $pull: { posts: post._id } })
        await Comment.deleteMany({ post: postId });

        res.status(200).json({ message: "Post deleted successfully", success: true })
    } catch (error) {
        console.log("Error in deletePost controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user.id
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ message: "post not found", success: false })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "post not found", success: false })
        }
        const isUserAlredaySaved = user.bookmarks.includes(post._id)
        if (isUserAlredaySaved) {
            await User.findByIdAndUpdate(user._id, { $pull: { bookmarks: post._id } })
            await Post.findByIdAndUpdate(post._id, { $pull: { bookmarks: user._id } })
            return res.status(200).json({ type: "Unsaved", message: "Post removed from bookmarks", success: true })
        } else {
            await User.findByIdAndUpdate(user._id, { $push: { bookmarks: post._id } })
            await Post.findByIdAndUpdate(post._id, { $push: { bookmarks: user._id } })
            return res.status(200).json({ type: "Saved", message: "Post saved to bookmarks", success: true })
        }

    } catch (error) {
        console.log("Error in bookmarkPost controllers", error.message)
        res.status(500).json({ message: "internal server error", success: false })
    }
}