import { View, Text, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, TextInput } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
;
import { useCurrentUser } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { router, useLocalSearchParams } from "expo-router";
import { useSocketStore } from "@/libs/socket";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import EmptyUi from "@/components/EmptyUi";
import { MessageSender } from "@/types";
import MessageBubble from "@/components/MessageBubble";
import { ChatInputWrapper } from "@/components/ChatInputWrapper";

type ChatParams = {
  id: string;
  participantId: string;
  name: string;
  avatar: string;
};
const ChatDetailsScreen = () => {
  const {
    id: chatId,
    participantId,
    avatar,
    name,
  } = useLocalSearchParams<ChatParams>();
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: currentUser } = useCurrentUser();

  const { data: messages, isLoading } = useMessages(chatId);
  const {
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    isConnected,
    onlineUsers,
    typingUsers,
  } = useSocketStore();

  const isOnline = participantId ? onlineUsers.has(participantId) : false;

  const isTyping = typingUsers.get(chatId) === participantId;

  const typingTimoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (chatId && isConnected) joinChat(chatId);
    return () => {
      if (chatId) leaveChat(chatId);
    };
  }, [chatId, isConnected, joinChat, leaveChat]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleTyping = useCallback(
    (text: string) => {
      setMessageText(text);
      if (!isConnected || !chatId) return;
      if (text.length > 0) {
        sendTyping(chatId, true);

        if (typingTimoutRef.current) {
          clearTimeout(typingTimoutRef.current);
        }
        typingTimoutRef.current = setTimeout(() => {
          sendTyping(chatId, false);
        }, 2000);
      } else {
        if (typingTimoutRef.current) {
          clearTimeout(typingTimoutRef.current);
        }
        sendTyping(chatId, false);
      }
    },
    [chatId, isConnected, sendTyping],
  );

  const handleSend = () => {
    console.log({isSending,isConnected,currentUser,messageText})
    if (!messageText.trim() || isSending || !isConnected || !currentUser)
      return;

    if (typingTimoutRef.current) {
      clearTimeout(typingTimoutRef.current);
    }
    sendTyping(chatId, false);

    setIsSending(true);

    sendMessage(chatId, messageText.trim(), {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
    });
    setMessageText("");
    setIsSending(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      <View className="flex-row items-center px-4 py-2 bg-surface border-b border-surface-light">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F4A261" />
        </Pressable>
        <View className="flex-row items-center flex-1 ml-2">
          {avatar && (
            <Image
              source={avatar}
              style={{ width: 40, height: 40, borderRadius: 999 }}
            />
          )}
          <View className="ml-3">
            <Text
              className="text-foreground font-semibold text-base"
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              className={`text-xs ${isTyping ? "text-primary" : "text-muted-foreground"}`}
            >
              {isTyping ? "typing" : isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center  ">
          <Pressable className="w-9 h-9 rounded-full items-center justify-center mr-2 ">
            <Ionicons name="call-outline" size={22} color={"#A0A0A5"} />
          </Pressable>
          
          <Pressable className="w-9 h-9 rounded-full items-center justify-center mr-2">
            <Ionicons name="videocam" size={22} color={"#A0A0A5"} />
          </Pressable>
        </View>
      </View>

              {/* Message + Keyboard input */}

              {/* <KeyboardAvoidingView className="flex-1"
              behavior='padding'
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}

              > */}
                <ChatInputWrapper
                onKeyboardShow={() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }}
                >
                <View className="flex-1 bg-surface ">
                  {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                      <ActivityIndicator size={'large'} color={'#F4A261'}/>
                    </View>
                  ): !messages || messages.length === 0 ?(
                    <EmptyUi
                    title="No message yet"
                    subtitle="Start the conversation"
                    iconName="chatbubble-outline"
                    iconColor="#6B6B70"
                    iconSize={64}
                    />  
                  ):
                 <ScrollView
                 ref={scrollViewRef}
                 contentContainerStyle={{paddingHorizontal:16,paddingVertical:12,gap:15}}
                 onContentSizeChange={()=>{
                  scrollViewRef.current?.scrollToEnd({animated:true})
                 }}
                 >
                    {messages?.map((message)=>{
                      const senderId = (message.sender as MessageSender)._id
                      const isFromMe = currentUser ? senderId ===currentUser._id :false
                      return <MessageBubble key={message._id} message={message} isFromMe ={isFromMe}/>
                     })}
                 </ScrollView>
                  }

                  <View className="px-3 pb-3 pt-2 bg-surface border-t border-surface-light">
                    <View className="flex-row items-center  rounded-3xl px-3 py-2 gap-2 bg-surface-card">
                      <Pressable className="w-8 h-8 rounded-full items-center justify-center ">
                        <Ionicons name="add" size={22} color={'#F4A261'}/>
                      </Pressable>
                      <TextInput
                      placeholder="Type a message"
                      placeholderTextColor={'#6B6B70'}
                      className="flex-1 p- text-foreground text-sm " 
                      multiline
                      style={{maxHeight:100}}
                      value={messageText}
                      onChangeText={handleTyping}
                      onSubmitEditing={handleSend}
                      editable = {!isSending}
                      />

                      <Pressable
                      className="w-10 h-10 rounded-full items-center justify-center bg-primary"
                      onPress={handleSend}
                      disabled={!messageText.trim() || isSending}
                      >
                          {isSending ? (
                            <ActivityIndicator size={'small'} color={'#0D0D0F'}/>
                          ):(
                            <Ionicons name="send" size={18} color={'#0D0D0F'}/>
                          )}
                      </Pressable>
                    </View>

                  </View>
                </View>
</ChatInputWrapper>
              {/* </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default ChatDetailsScreen;
