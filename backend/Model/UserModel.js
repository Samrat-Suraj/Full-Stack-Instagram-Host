import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username : {type : String , required : true , unique : true},
    email : {type : String , required : true , unique : true},
    password : {type : String , required : true},
    profilePicture : {type : String , default : ""},
    bio : {type : String },
    gender : {type : String , enum : ["male","female"]},
    following : [{type : mongoose.Schema.Types.ObjectId , ref : "User"}],
    followers : [{type : mongoose.Schema.Types.ObjectId , ref : "User"}],
    bookmarks : [{type : mongoose.Schema.Types.ObjectId , ref : "Post"}],
    posts : [{type : mongoose.Schema.Types.ObjectId , ref : "Post"}],
    
},{timestamps : true})

export const User = mongoose.model("User" , userSchema)