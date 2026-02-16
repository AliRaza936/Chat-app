import { View, Text, ScrollView, Button, ActivityIndicator, FlatList, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native';
import { useRouter } from 'expo-router';
import { useChats } from '@/hooks/useChats';
import { Ionicons } from '@expo/vector-icons';
import ChatItem from '@/components/ChatItem';
import EmptyUi from '@/components/EmptyUi';
import { Chat } from '@/types';

const ChatTab = () => {
  const router = useRouter()
  const {data:chats,isLoading,error,refetch} = useChats()

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
      data={chats}
      keyExtractor={(item)=>item._id}

      renderItem={({item})=><ChatItem chat={item} onPress={()=>handleChatPress(item)}/> }
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