import type { NextFunction, Request, Response } from "express"
import { User } from "../models/User.ts"
import type { AuthRequest } from "../middleware/auth.ts"

export async function getUsers(req:AuthRequest,res:Response,next:NextFunction) {
    try {
        const userId = req.userId
        if(!userId) {
            res.status(401)
            throw new Error("Unauthorized")
        }
        const users = await User.find({_id:{$ne:userId}}).select("name email avatar").limit(50)
        res.json(users)
    } catch (error) {
        res.status(500)
        next(error)
    }
}