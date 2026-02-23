import {create} from 'zustand'
import {Socket,io} from "socket.io-client"
import { Query, QueryClient } from '@tanstack/react-query'
import { Chat, Message, MessageSender } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useId } from 'react'

const SOCKET_URL =  "https://just-chat-gc9s.onrender.com"
interface SocketState{
    socket:Socket | null
    isConnected:boolean
    onlineUsers:Set<string>
    typingUsers:Map<string,string>
    unReadChats:Set<string>
    currentChatId:string | null
    queryClient: QueryClient | null
    userId: string | null;

    connect : (token:string,queryClient:QueryClient)=>void
    disconnect:()=>void
    joinChat:(chatId:string)=>void
    initUnreadChats:(chats:Chat[],id:string)=>void
    leaveChat:(chatId:string)=>void
    sendMessage:(chatId:string,text:string,currentUser:MessageSender)=>void
    sendTyping:(chatId:string,isTyping:boolean)=>void

}
export const useSocketStore = create<SocketState>((set,get)=>({
   socket:null,
   isConnected:false,
   onlineUsers:new Set(),
   typingUsers:new Map(),
   unReadChats:new Set(),
   currentChatId:null,
   queryClient:null,
   userId: null,

   connect:(token,queryClient)=>{
    const existingSocket = get().socket
    if(existingSocket?.connected) return

    if (existingSocket) {
    existingSocket.removeAllListeners();
    existingSocket.disconnect();
  }


    const socket = io(SOCKET_URL,{auth:{token}})

    socket.on('connect', async()=>{
        console.log('Socket Connected id:',socket.id)
        set({isConnected:true})
    })
    socket.on('disconnet',()=>{
        console.log('Socket disconneted id:',socket.id)
        set({isConnected:false})

    })
    socket.on('online-users',({userIds}:{userIds:string})=>{
        console.log('Received Online Users:',userIds)
        set({onlineUsers: new Set(userIds)})
    })
    socket.on('user-online',({userId}:{userId:string})=>{
        
        set((state)=>({
            onlineUsers: new Set([...state.onlineUsers,userId])
        }))
    })
    socket.on('user-offline',({userId}:{userId:string})=>{
        
        set((state)=>{
            const onlineUsers = new Set(state.onlineUsers)
                onlineUsers.delete(userId)
                return { onlineUsers:onlineUsers}
        })
    })
    socket.on('socket-error',(error:{message:string})=>{
        console.error("Socket error:", error.message)
    })
socket.on('chat-read-updated', (updatedChat: Chat) => {
  const { queryClient, currentChatId, userId } = get();
  if (!queryClient || !userId) return;

  // Update chats cache
  queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => {
    if (!oldChats) return oldChats;

   return oldChats.map(chat => {
  if (chat._id === updatedChat._id) {
    const { lastMessage } = updatedChat;
    return {
      ...chat,
      lastMessage: {
        ...chat.lastMessage,
        readBy: lastMessage?.readBy ?? []
      }
    } as Chat;
  }
  return chat;
});
  });

  // Remove from unReadChats if current user has read
  if (currentChatId === updatedChat._id) {
    set((state) => {
      const unReadChats = new Set(state.unReadChats);
      unReadChats.delete(updatedChat._id);
      return { unReadChats };
    });
  }
});
   socket.on('new-message', async (message: Message) => {
  const senderId = (message.sender as MessageSender)._id;
  const { currentChatId, queryClient } = get();
  const userId = await AsyncStorage.getItem('userId') || '';

  if (!queryClient) return;

  // 1️⃣ Update messages for this chat
  queryClient.setQueryData<Message[]>(['messages', message.chat], (old) => {
    if (!old) return [message];
    const filtered = old.filter((m) => !m._id.startsWith("temp-"));
    if (filtered.some((m) => m._id === message._id)) return filtered;
    return [...filtered, message];
  });

  // 2️⃣ Update chats cache
  queryClient.setQueryData<Chat[]>(['chats'], (oldChats) => {
    if (!oldChats) return [];

    const senderUser: MessageSender =
      typeof message.sender === "string"
        ? { _id: message.sender } as MessageSender
        : message.sender;

    const exists = oldChats.some((c) => c._id === message.chat);

    if (!exists) {
      // Insert new chat at top
      const newChat: Chat = {
        _id: message.chat,
        participants: senderUser,
        lastMessage: {
          _id: message._id,
          text: message.text,
          sender: senderId,
          createdAt: message.createdAt,
          readBy: [], // ✅ include readBy
        },
        lastMessageAt: message.createdAt,
        createdAt: message.createdAt,
      };
      return [newChat, ...oldChats];
    }

    // Update existing chat
    return oldChats.map((chat) => {
      if (chat._id === message.chat) {
        return {
          ...chat,
          lastMessage: {
            _id: message._id,
            text: message.text,
            sender: senderId,
            createdAt: message.createdAt,
            readBy: chat.lastMessage?.readBy || [], // ✅ include readBy
          },
          lastMessageAt: message.createdAt,
        };
      }
      return chat;
    });
  });

  // 3️⃣ Handle unReadChats in Zustand


if (senderId !== userId && currentChatId !== message.chat) {
  set((state) => ({
    unReadChats: new Set([...state.unReadChats, message.chat]),
  }));
}

  // 4️⃣ Remove typing if user sent a message
  set((state) => {
    const typingUsers = new Map(state.typingUsers);
    typingUsers.delete(message.chat);
    return { typingUsers };
  });
});

    socket.on('typing',({userId,chatId,isTyping}:{userId:string,chatId:string,isTyping:boolean})=>{
        set((state)=>{
            const typingUsers = new Map(state.typingUsers)
            if(isTyping) typingUsers.set(chatId,userId)
                else typingUsers.delete(chatId)
            return{typingUsers:typingUsers}
        })
    })

    set({socket,queryClient})
   },

   disconnect:()=>{
    const socket = get().socket
    if(socket){
        socket.removeAllListeners();
        socket.disconnect()
        set({
              socket:null,
   isConnected:false,
   onlineUsers:new Set(),
   typingUsers:new Map(),
   unReadChats:new Set(),
   currentChatId:null,
   queryClient:null,
        })
    }
   },
   joinChat:(chatId)=>{
    const socket = get().socket
    set((state)=>{
        const unreadChats = new Set(state.unReadChats)
        unreadChats.delete(chatId)
        return {currentChatId:chatId,unReadChats:unreadChats}
    })
    if(socket?.connected){
        socket.emit('join-chat',chatId)
    }
   },

   leaveChat:(chatId)=>{
    const socket = get().socket
    set({currentChatId:null})
     if(socket?.connected){
        socket.emit('leave-chat',chatId)
    }
   },

   sendMessage:(chatId,text,currentUser)=>{
    const {socket,queryClient} = get()
    if(!socket?.connected ||  !queryClient) return

    const tempId = `temp-${Date.now()}`

    const optimisticMessage:Message={
        _id:tempId,
        chat:chatId,
        sender:currentUser,
        text,
        createdAt:new Date().toISOString(),
        updatedAt:new Date().toISOString()
    }

    queryClient.setQueryData<Message[]>(['messages',chatId],(old)=>{
        if(!old) return [optimisticMessage]
        return[...old,optimisticMessage]
    })
    socket.emit('send-message',{chatId,text})

    const errorHandler = (error:{message:string})=>{
        console.log('Message send error:',chatId,error)

        queryClient.setQueryData<Message[]>(['messages',chatId],(old)=>{
            if(!old) return
            return old.filter((m)=>m._id !== tempId)
        })
        socket.off('socket-error',errorHandler)
    }
    socket.once('socket-error',errorHandler)
   },

   sendTyping:(chatId,isTyping)=>{
    const socket = get().socket
    if(socket?.connected){
        socket.emit('typing',{chatId,isTyping})
    }
   },
   initUnreadChats: (chats: Chat[], userId: string) => {

  const unreadIds = chats.map(c => c._id);

  set({ unReadChats: new Set(unreadIds) })
},
   

}))