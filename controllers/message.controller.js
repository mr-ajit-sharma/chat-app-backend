// import mongoose from 'mongoose'
import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
    try {
        const senderId = await req.id;
        const receiverId = await req.params.id;
        const { message } = req.body;
        let gotConversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } })
        if (!gotConversation) {
            gotConversation = await Conversation.create({ participants: [senderId, receiverId] })
        }
        const newMessage = await Message.create({ senderId, receiverId, message })
        if (newMessage) {
            gotConversation.messages.push(newMessage._id)
        }
        await Promise.all([gotConversation.save(),newMessage.save()])
        // socket io
        const receiverSocketId=getReceiverSocketId(receiverId)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        return res.status(200).json({newMessage })
    } catch (error) {
        console.log(error)
    }
}

export const getMessage=async(req,res)=>{
    try {
        const receiverId=await req.params.id;
        const senderId=await req.id
        const conversation=await Conversation.findOne({participants:{$all:[senderId,receiverId]}}).populate("messages")
        // console.log(conversation,".../ conversartrion")
        return res.status(200).json(conversation?.messages)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error in getting the message"})
    }
}