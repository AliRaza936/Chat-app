
import type { NextFunction, Request, Response } from "express"
import { User } from "../models/User.ts"
import type { AuthRequest } from "../middleware/auth.ts"
import { Chat } from "../models/Chat.ts"
import { Message } from "../models/Message.ts"

export async function getMessages(req:AuthRequest,res:Response,next:NextFunction) {
    try {
        const userId = req.userId
        const {chatId} = req.params
        const chat = await Chat.findOne({
            _id:chatId!,
            participants:userId!
        })
        if(!chat) {
            res.status(404)
            throw new Error("Chat not found")
        }
        
        const message = await Message.find({chat:chatId!}).populate("sender","name email avatar").sort({createdAt:1})
        res.json(message)
    } catch (error) {
        res.status(500)
        next(error)
    }
}