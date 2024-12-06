import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author : {type : mongoose.Schema.Types.ObjectId , ref : "User"},
    post : {type : mongoose.Schema.Types.ObjectId , ref : "Post"},
    text : {type : String , required : true},
},{timestamps : true})

export const Comment = mongoose.model("Comment" , commentSchema)