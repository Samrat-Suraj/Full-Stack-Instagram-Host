import { Conversation } from "../Model/ConversationModel.js";
import { Message } from "../Model/MessageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ message: "Message content cannot be empty" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
                messages : []
            });
            await conversation.save();
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
            await Promise.all([conversation.save(), newMessage.save()]);
        }

        //Socket impelement for real time message impletement in frontend
        //Pending Notes
        const receiverSockedId = getReceiverSocketId(receiverId)
        if(receiverSockedId){
            io.to(receiverSockedId).emit("newMessage" , newMessage )
        }
        
        res.status(200).json({ success : true, message: "Message sent successfully", newMessage });
    } catch (error) {
        console.error("Error in SendMessage Controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        const conversations = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (conversations.length === 0) {
            return res.status(200).json({ messages: [], success: true });
        }
        return res.status(200).json({ messages: conversations.messages, success: true });

    } catch (error) {
        console.error("Error in getMessage Controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
