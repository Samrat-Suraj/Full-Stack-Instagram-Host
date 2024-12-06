import { Server } from "socket.io"
import express from "express"
import http from "http"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const userSocketMap = {};

//Pending Notes
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId]

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    if (userId) {
        userSocketMap[userId] = socket.id
        // console.log(`User Connected UserId = ${userId} socketId = ${socket.id}`)
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        if (userId) {
            // console.log(`User Disconnected UserId = ${userId} socketId = ${socket.id}`)
            delete userSocketMap[userId]  // Fixed the log message
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})
export { app, server, io };