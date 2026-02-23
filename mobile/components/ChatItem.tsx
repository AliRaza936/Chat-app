import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Chat } from '@/types'
import { Image } from 'expo-image'
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { useSocketStore } from '@/libs/socket'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ChatItem = ({ chat, onPress, chatId }: { chat: Chat; onPress: () => void; chatId: string }) => {
  const [userId, setUserId] = useState<string | null>(null)

  // Fetch userId only once
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId')
      setUserId(id)
      
    }
    fetchUserId()
  }, [])

  const participant = chat.participants
  const { onlineUsers, typingUsers, unReadChats:unreadChats } = useSocketStore()
  const isOnline = onlineUsers.has(participant._id)
  const isTyping = typingUsers.get(chat._id) === participant._id
  const hasUnRead = unreadChats.has(chat._id);

  // Determine unread messages based on your logic
  // const hasUnRead = chat.lastMessage
  // ? !chat.lastMessage.readBy?.includes(userId || '') // safer
  // : false

  return (
    <Pressable className='flex-row items-center py-3 active:opacity-70' onPress={onPress}>
      <View className='relative'>
        <Image source={participant?.avatar} style={{ width: 56, height: 56, borderRadius: 999 }} />
        {isOnline && (
          <View className='absolute bottom-0 right-0 size-4 bg-green-500 rounded-full border-[3px] border-surface' />
        )}
      </View>

      <View className='flex-1 ml-4'>
        <View className='flex-row items-center justify-between'>
          <Text className={`text-base font-medium ${hasUnRead ? "text-primary" : "text-foreground"}`}>
            {participant?.name}
          </Text>
          <View className='flex-row items-center gap-2'>
            {hasUnRead && <View className='w-2.5 h-2.5 bg-primary rounded-full' />}
            <Text className='text-subtle-foreground text-sm'>
              {chat.lastMessageAt ? formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: false }) : ''}
            </Text>
          </View>
        </View>

        <View className='flex-row items-center justify-between mt-1'>
          {isTyping ? (
            <Text className='text-sm text-primary italic'>Typing...</Text>
          ) : (
            <Text
              className={`text-sm flex-1 mr-3 ${hasUnRead ? "text-foreground font-medium" : "text-subtle-foreground"}`}
              numberOfLines={1}
            >
              {chat.lastMessage?.text || "No messages yet"}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  )
}

export default ChatItem