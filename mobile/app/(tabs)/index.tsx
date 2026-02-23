import { View, Text, ScrollView, Button, ActivityIndicator, FlatList, Pressable } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useChats } from '@/hooks/useChats';
import { Ionicons } from '@expo/vector-icons';
import ChatItem from '@/components/ChatItem';
import EmptyUi from '@/components/EmptyUi';
import { Chat } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSocketStore } from '@/libs/socket';

const ChatTab = () => {
  const router = useRouter()
  const {data:chats,isLoading,error,refetch} = useChats({subscribeToUpdates:true})
  const {initUnreadChats} = useSocketStore()
//  useFocusEffect(
//     useCallback(() => {
//       refetch();
//     }, [])
  // );
 const [userId, setUserId] = useState<string | null>(null)
 
   // Fetch userId only once d
 useEffect(() => {
  const fetchUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    if (!id || !chats) return;

    console.log("Current userId:", id);
    setUserId(id);

    // Filter unread chats
    const initChats = chats.filter(chat => {
      const lastMessage = chat.lastMessage;
      if (!lastMessage) return false; // skip chats with no messages

      // Only consider messages from other users
      if (lastMessage.sender === id) return false;

      const readBy = lastMessage.readBy || []; // default to empty array if undefined
      return readBy.length === 0; // unread if nobody has read it yet
    });

    console.log("Unread chats:", initChats);
    initUnreadChats(initChats, id);
  };

  fetchUserId();
}, [chats]);

// Sorted chats
const sortedChats = useMemo(() => {
  if (!chats || !userId) return [];
  return [...chats].sort((a, b) => {
    const aUnread = a.lastMessage ? !a.lastMessage.readBy?.includes(userId) : false;
    const bUnread = b.lastMessage ? !b.lastMessage.readBy?.includes(userId) : false;

    // 1️⃣ unread messages first
    if (aUnread && !bUnread) return -1;
    if (!aUnread && bUnread) return 1;

    // 2️⃣ sort by last message timestamp (newest first)
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return bTime - aTime;
  });
}, [chats, userId]);
  if(isLoading){
    return(
      <View className='flex-1 bg-surface items-center justify-center'>
        <ActivityIndicator size={'large'} color={'#f4A261'}/>
      </View> 
    )
  }

  if(error){
    return(
      <View className='flex-1 bg-surface items-center justify-center'>
        <Text className='text-red-500'>Failed to load chats</Text>
        <Pressable className='mt-4 px-4 py-2 bg-primary rounded-lg' onPress={()=>refetch()}>
          <Text className='text-foreground'>Retry</Text>
        </Pressable>
      </View>
    )
  }
  const handleChatPress = (chat:Chat)=>{
    console.log(chat)
  
    router.push({
      pathname:"/chat/[id]",
      params:{
        id:chat._id,
        participantId:chat.participants._id,
        name:chat.participants.name,
        avatar:chat.participants.avatar
      }
    })
  }
  return (

    <SafeAreaView className='bg-surface flex-1'>
      <FlatList
      data={sortedChats}
      keyExtractor={(item)=>item._id}

      renderItem={({item})=><ChatItem chat={item} chatId={item._id} onPress={()=>handleChatPress(item)}/> }
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{paddingHorizontal:20,paddingTop:16,paddingBottom:24}}
      ListHeaderComponent={<Header/>}
      ListEmptyComponent={<EmptyUi 
      title='No chats yet'
      subtitle='Start a conversation'
      iconName='chatbubble-outline'
      iconColor='#6B6B70'
      iconSize={64}
      buttonLabel='New Chat'
      onPressButton={()=> router.push("/new-chat")}
      />}
      />
    </SafeAreaView>
  )
}

export default ChatTab

function Header(){
  const router = useRouter()
  return (
    <View className='px-5 pt-2 pb-4 '>
      <View className='flex-row items-center justify-between'>
        <Text className='text-2xl font-bold text-foreground'>Chats</Text>
        <Pressable
        className='size-10 bg-primary rounded-full items-center justify-center'
        onPress={()=>router.push("/new-chat")}
        >
          <Ionicons name='create-outline' size={20} color={'#0D0D0F'}/>
        </Pressable>
      </View>
    </View>
  )
}