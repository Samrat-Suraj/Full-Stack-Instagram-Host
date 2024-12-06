import jwt from "jsonwebtoken"
import { EnvVars } from "../config/EnvVars.js"

export const GenTokenAndsetCookie = (userId , res) =>{
    const token = jwt.sign({userId} , EnvVars.JWT_SECRET , {expiresIn : "15d"});

    res.cookie("Social-Media" , token , ({
        maxAge : 15 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameStite : "strict",
    }))
    return token
}