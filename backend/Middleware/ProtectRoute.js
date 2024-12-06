import jwt from "jsonwebtoken"
import { EnvVars } from "../config/EnvVars.js"
import { User } from "../Model/UserModel.js"

export const protectRoute = async (req ,res , next)=>{
    try {
        const token = req.cookies["Social-Media"]
        if(!token){
            return res.status(400).json({message : "User not found / Token not found " , success : false})
        }

        const decorded = jwt.verify(token , EnvVars.JWT_SECRET)
        if(!decorded){
            return res.status(400).json({message : "Invaild Token" , success : false})
        }

        const user = await User.findById(decorded.userId).select("-password")
        if(!user){
            return res.status(400).json({message : "user not found" , success : false})
        }

        req.user = user
        next()
    } catch (error) {
        console.log("Error in protectMiddleware" , error.message)
        res.status(500).json({message : "internal server error" , success : false})
    }
}