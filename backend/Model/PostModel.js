import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: { type: String, default: "" },
    image: { type: String, default: "" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
}, { timestamps: true })

export const Post = mongoose.model("Post", postSchema)