
import type { NextFunction, Request, Response } from "express"
import { User } from "../models/User.ts"
import type { AuthRequest } from "../middleware/auth.ts"
import { Chat } from "../models/Chat.ts"
import { Message } from "../models/Message.ts"

export async function getChats(req:AuthRequest,res:Response,next:NextFunction) {
    try {
        const userId = req.userId
        
       const chats = await Chat.find({participants:userId!}).populate("participants","name email avatar")
       .populate("lastMessage").sort({lastMessageAt:-1})

       const formatedChat = chats.map((chat)=>{
        const otherParticipant = chat.participants.find((participant)=>participant._id.toString()!==userId)
        return{
            _id:chat._id,
            participants:otherParticipant ?? null,
            lastMessage:chat.lastMessage,
            lastMessageAt:chat.lastMessageAt,
            createdAt:chat.createdAt,
        }
       })
       res.json(formatedChat)
       
    } catch (error) {
        res.status(500)
        console.log(error)
        next(error)
    }
}
export async function getOrCreateChat(req:AuthRequest,res:Response,next:NextFunction) {
    try {
        const userId = req.userId
        console.log(userId)
        const {participantId} = req.params
        if(!participantId){
            res.status(400).json({message:'Participant ID is required'})
            return
        }
        if(participantId === userId){
            res.status(400).json({message:'Cannot create chat with yourself'})
            return
        }
        let chat = await Chat.findOne({
            participants:{$all:[userId,participantId]}
        }).populate("participants","name email avatar")
       .populate("lastMessage").sort({lastMessageAt:-1})

       if(!chat){
        const newChat = new Chat({
            participants:[userId,participantId]
        })
        await newChat.save()
        chat = await newChat.populate("participants","name email avatar")
       }
       const otherParticipant = chat?.participants.find((p:any)=>p._id.toString()!==userId);

       res.json({
       _id:chat._id,
       participants:otherParticipant ?? null,
       lastMessage:chat.lastMessage,
       lastMessageAt:chat.lastMessageAt,
       createdAt:chat.createdAt 
       })
    } catch (error) {
        res.status(500)
        console.log(error)
        next(error)
    }
}