import dotenv from "dotenv"
dotenv.config()

export const EnvVars = {
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    FRONTEND_CONNECT_URL : process.env.FRONTEND_CONNECT_URL,
    NODE_ENV : process.env.NODE_ENV
}