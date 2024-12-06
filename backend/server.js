import express from "express"
import { app , server } from "./socket/socket.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from 'path';

import UserRouter from "./Router/UserRouter.js"
import PostRouter from "./Router/PostRouter.js"
import MessageRouter from "./Router/MessageRouter.js"

import MongoDb from "./config/MongoDb.js"
import { EnvVars } from "./config/EnvVars.js"

const _dirname = path.resolve();


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true,
}))

app.use("/api/v1/user" , UserRouter)
app.use("/api/v1/post" , PostRouter)
app.use("/api/v1/message" , MessageRouter)


app.use(express.static(path.join(_dirname, "/frontend/dist")));


app.get("*", (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});


const PORT = 5000 || EnvVars.PORT
server.listen(PORT , ()=>{
    MongoDb()
    console.log("Server Listen on http://localhost:"+ PORT)
})