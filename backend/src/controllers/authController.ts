import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.ts";
import { User } from "../models/User.ts";
import { clerkClient, getAuth } from "@clerk/express";
import { OAuth2Client } from "google-auth-library";

import jwt from "jsonwebtoken";
const client = new OAuth2Client(process.env.GOOGLE_WEB_ID);

function createToken(userId: string) {

  const secret = process.env.JWT_SECRET!;
  
 
  const token = jwt.sign(
    { userId },         
    secret,             
  );

  return token;
}

export async function getMe(req:AuthRequest,res:Response,next:NextFunction) {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if(!user){
             res.status(404).json({message:"User not found"})
            return
        }
        res.status(200).json(user)

    } catch (error) {
        res.status(500)
        next(error)
    }
}

export async function authCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { idToken } = req.body;
console.log(idToken)
    if (!idToken) {
      return res.status(400).json({ message: "idToken required" });
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_ID as string,
    });

    const payload = ticket.getPayload();

    const email = payload?.email!;
    const name = payload?.name || "";
    const avatar = payload?.picture || "";
    const providerId = payload?.sub!; 

    let user = await User.findOne({
      providerId,
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
        providerId,
      });
    }

    
    const token = createToken(user._id.toString());

    res.json({
      user,
      token,
    });
    console.log(user)
  } catch (error) {
    res.status(500);
    console.log(error)
    next(error);
  }
}