import { v2 as cloudinary } from "cloudinary";
import { EnvVars } from "../config/EnvVars.js";

cloudinary.config({
    api_key : EnvVars.CLOUDINARY_API_KEY,
    api_secret : EnvVars.CLOUDINARY_API_SECRET,
    cloud_name : EnvVars.CLOUDINARY_NAME
})

export default cloudinary