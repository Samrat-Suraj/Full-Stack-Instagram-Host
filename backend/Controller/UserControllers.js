import { User } from "../Model/UserModel.js";
import bcrypt from "bcryptjs"
import { GenTokenAndsetCookie } from "../utils/GenTokenAndsetCookie.js";
import DataUri from "../utils/DataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../Model/PostModel.js";

export const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invaild email address" })
        }
        const userByUsername = await User.findOne({ username })
        if (userByUsername) {
            return res.status(400).json({ success: false, message: "Username already register" })
        }
        const userByemail = await User.findOne({ email })
        if (userByemail) {
            return res.status(400).json({ success: false, message: "Email already register" })
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must have 6 characters long" })
        }

        const salt = await bcrypt.genSalt(10);
        const hasedpassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hasedpassword
        })

        if (newUser) {
            await newUser.save();
            GenTokenAndsetCookie(newUser.id, res)
            res.status(201).json({
                message: "User Register Successfully", success: true, user: {
                    ...newUser._doc,
                    password: null
                }
            })
        }

    } catch (error) {
        console.log("Error in Register Controllers", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "passwords atleast 6 charcters long" });
        }
        const isMatchUser = await bcrypt.compare(password, user.password)
        if (!isMatchUser) {
            return res.status(400).json({ success: false, message: "invaild email or password" });
        }

        // populate each post if in the posts array
        // Ek Array hai use uske andar multipal id hai hai to  Promise.all ka use kregenge
        // The Promise.all method is used in your code to handle multiple asynchronous operations concurrently and efficiently

        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )

        GenTokenAndsetCookie(user._id, res)
        res.status(200).json({
            success: true, message: "logged in successfully", user: {
                ...user._doc,
                password: undefined,
                posts : populatedPosts
            }
        })
    } catch (error) {
        console.log("Error in login Controllers", error)
        // res.status(500).json({ error: "internal server error" })
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie("Social-Media")
        res.status(200).json({ success : true, message: "Logged Out successfully" })
    } catch (error) {
        console.log("Error in logout Controllers", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "User not found ", success: false })
        }

        let uploadresponse;
        if (profilePicture) {
            if (user.profilePicture) {
                const oldpublicId = user.profilePicture.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(oldpublicId)
            }
            const fileUri = DataUri(profilePicture)
            uploadresponse = await cloudinary.uploader.upload(fileUri)
            user.profilePicture = uploadresponse.secure_url
        }

        user.bio = bio || user.bio
        user.gender = gender || user.gender

        await user.save()
        res.status(200).json({ message: "profile updated successfully", success: true, user })

    } catch (error) {
        console.log("Error in editProfile Controllers", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const getProfile = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).populate({path : "posts"}).populate({path : "bookmarks"})
        if (!user) {
            return res.status(400).json({ message: "user not found", success: false })
        }
        return res.status(200).json({ user: { ...user._doc, password: undefined } })
    } catch (error) {
        console.log("Error in getProfile Controllers", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "User not found ", success: false })
        }
        const users = await User.aggregate([
            { $match: { _id: { $ne: user._id, $nin: user.following } } },
            { $project: { password: 0 } },
            { $sample: { size: 4 } }
        ])

        return res.status(200).json({ users })
    } catch (error) {
        console.log("Error in getSuggestedUsers Controllers", error.message)
        res.status(500).json({ error: "internal server error" })
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const userId = req.user.id;
        const otherUserId = req.params.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }
        const modifyedUser = await User.findById(otherUserId).select("-password");
        if (!modifyedUser) {
            return res.status(400).json({ message: "User to follow/unfollow not found", success: false });
        }
        if (user._id.toString() === modifyedUser._id.toString()) {
            return res.status(400).json({ message: "You cannot follow or unfollow yourself", success: false });
        }        
        
        const isFollowing = user.following.includes(modifyedUser._id);

        if (isFollowing) {
            await User.findByIdAndUpdate(modifyedUser._id, { $pull: { followers: user._id } });
            await User.findByIdAndUpdate(user._id, { $pull: { following: modifyedUser._id } });
            return res.status(200).json({ message: "Unfollowed successfully", success: true });
        } else {
            await User.findByIdAndUpdate(modifyedUser._id, { $push: { followers: user._id } });
            await User.findByIdAndUpdate(user._id, { $push: { following: modifyedUser._id } });
            return res.status(200).json({ message: "Followed successfully", success: true });
        }

    } catch (error) {
        console.error("Error in followOrUnfollow controller:", error.message);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};



export const GetUserByQuery = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        
        // Query to find a user with a username matching the keyword
        const query = {
            $or: [
                { username: { $regex: keyword, $options: "i" } } // case-insensitive match
            ]
        };

        // Using find() to query users based on the keyword
        const users = await User.find(query).select("-password");

        if (users.length === 0) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.log("Error in GetUserByQuery Controllers", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const GetAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.log("Error in GetUserByQuery Controllers", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
