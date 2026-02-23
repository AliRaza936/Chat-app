import { View, Text } from 'react-native'
import React from 'react'
import { Message } from '@/types'

const MessageBubble = ({message,isFromMe}:{message:Message,isFromMe:boolean}) => {

  const formatTime = (dateString:string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <View className={`flex-row ${isFromMe ? 'justify-end':"justify-start"}`}>
      <View
      className={`max-w-[80%] px-3 py-2 rounded-2xl ${ isFromMe ? "bg-primary rounded-br-sm":"bg-surface-card rounded-bl-sm border border-surface-light"}`}
      >
          <Text className={`text-sm ${isFromMe ? "text-surface-dark":"text-foreground"}`}>
            {message.text}
          </Text>

          <Text className={`text-[10px] mt-1 opacity-60 text-right ${isFromMe ?"text-surface-light":'text-muted-foreground'}`}>
            {formatTime(message.createdAt)}
          </Text>
      </View>
    </View>
  )
}

export default MessageBubble