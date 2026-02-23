import { Socket,Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { User } from "../models/User.ts";
import { Message } from "../models/Message.ts";
import { Chat } from "../models/Chat.ts";
import jwt from "jsonwebtoken";

// store online users in memory
export const onlineUsers:Map <string,string> = new Map()

export const initailizeSocket = (httpServer: HttpServer) => {
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:8081",
        process.env.FRONTEND_URL as string,
    ];
    const io = new SocketServer(httpServer,{cors:{origin:allowedOrigins}});
// verify socket connection if user is authenticated , and store userId in socket object
    io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(new Error("Authentication error"));

  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    const userId = payload.userId; 

    const user = await User.findById(userId);
    if (!user) return next(new Error("User not found"));

    socket.data.userId = user._id.toString();
    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});

    io.on('connection',(socket)=>{

        const userId = socket.data.userId;
        //  send list of currently online users to the newly connected user
        socket.emit('online-users',{userIds:Array.from(onlineUsers.keys())});

        // store the userId and socketId in onlineUsers map
        onlineUsers.set(userId!,socket.id);
        
        //  notify all other users that this user is online
        socket.broadcast.emit('user-online',{userId})

        socket.join(`user:${userId}`)

        socket.on('join-chat', async(chatId:string)=>{
            socket.join(`chat:${chatId}`)
            const oldchat = await Chat.findById(chatId).populate('lastMessage');

             try {
    if(oldchat?.lastMessage && oldchat?.lastMessage?.sender == userId) return
    await Message.updateMany(
      {
        chat: chatId,
        readBy: { $ne: userId }, 
      },
      { $addToSet: { readBy: userId } }
    );

    // Optionally, emit an update to the user to refresh the chat list
    const updatedChat = await Chat.findById(chatId).populate('lastMessage');
    socket.emit('chat-read-updated', updatedChat);

  } catch (err) {
    console.error("Error marking messages as read:", err);
  }
        })

        socket.on('leave-chat',(chatId:string)=>{
            socket.leave(`chat:${chatId}`)
        })
        //  handle sending message
        socket.on('send-message',async(data:{chatId:string,text:string})=>{
            try {
                const {chatId,text} = data;

                const chat = await Chat.findOne({
                    _id:chatId,
                    participants:userId!
                })
                if(!chat){
                    socket.emit('socket-error',{message:'Chat not found'});
                    return
                }
                const message = await Message.create({
                    chat:chatId,
                    sender:userId!,
                    text,
                })
                chat.lastMessage = message._id
                chat.lastMessageAt = new Date();
                await chat.save();
                await message.populate('sender','name avatar'); 

                // emit to chat room (for users inside the chat)
                io.to(`chat:${chatId}`).emit('new-message',message)

                // also emit to paricipants personal room (for chat list view)
                for (const participantId of chat.participants){
                    io.to(`user:${participantId}`).emit('new-message',message)
                }
            } catch (error) {
                console.log(error,'Message not send to backend')
                    socket.emit('socket-error',{message:'Failed to send message'});
                
            }
        })
        
        // typing indicator
        socket.on('typing',async(data:{chatId:string,isTyping:boolean})=>{
          const typingPayLoad = {
            userId,
            chatId:data.chatId,
            isTyping:data.isTyping
          }

          socket.to(`chat:${data.chatId}`).emit('typing',typingPayLoad)

          try{
            const chat = await Chat.findById(data.chatId)
            if(chat){
                const otherParticipantId = chat.participants.find((p:any)=>p.toString() !== userId)
                if(otherParticipantId){
                    socket.to(`user:${otherParticipantId}`).emit('typing',typingPayLoad)
                }
            }
          }catch(error){
//  silently fail - typing indicator isnot critical 
          }
        })

        socket.on('disconnect',()=>{
            onlineUsers.delete(userId!);

             socket.broadcast.emit('user-offline',{userId})
        })
    })
    return io;
}