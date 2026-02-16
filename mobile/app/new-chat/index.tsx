import { View, Text, Pressable, TextInput, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useUsers } from '@/hooks/useUser'
import { useGetOrCreateChat } from '@/hooks/useChats'
import { User } from '@/types'
import UserItems from '@/components/UserItems'
import { useSocketStore } from '@/libs/socket'

const NewChatScreen = () => {
  const {data:allUsers , isLoading} = useUsers()
  const [searchQuery,setSearchQuery] = useState('')
  const {mutate:getOrCreateChat, isPending:isCreatingChat} = useGetOrCreateChat()
    const {onlineUsers} = useSocketStore()

  const users = allUsers?.filter((u)=>{
    if(!searchQuery.trim())return true
    const query = searchQuery.toLowerCase();
    return u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
  })

  const handleUserSelect = (user:User)=>{
    getOrCreateChat(user?._id,{
      onSuccess:(chat)=>{
        console.log(chat)
        router.dismiss()
         setTimeout(() => {
           router.push({
      pathname:`/chat/[id]`,
      params:{
        id:chat._id,
        participantId:chat.participants._id,
        name:chat.participants.name,
        avatar:chat.participants.avatar
      }
    })
         }, 200);
      }
    })
  }
// const handleUserSelect = (user: User) => {
//   getOrCreateChat(user._id, {
//     onSuccess: (chat) => {
//       console.log(chat)
//       router.push(
//         `/chat/${chat._id}?participantId=${chat.participant._id}&name=${encodeURIComponent(chat.participant.name)}&avatar=${encodeURIComponent(chat.participant.avatar)}`
//       );
//     },
//   });
// };

  return (
    <SafeAreaView className='flex-1 bg-black' edges={["top"]}>
     <View className='flex-1 bg-black/20 justify-end'>
        <View className='bg-surface rounded-t-3xl h-[95%] overflow-hidden'>
          <View className='px-5 pt-3 pb-3 bg-surface border-b border-surface-light flex-row items-center'> 
            <Pressable className='w-9 h-9 rounded-full items-center justify-center  mr-2 bg-surface-card'
            onPress={()=> router.back()}
            >
              <Ionicons name='close' size={20} color={'#F4A261'}/>
            </Pressable>

            <View className='flex-1'>
              <Text className='text-foreground text-xl font-semibold'>New chat</Text>
              <Text className='text-muted-foreground text-xs mt-0.5'>Search for a user to start chating</Text>
            </View>
          </View>

            <View className='px-5 pt-3 pb-2 bg-surface'>
              <View className='flex-row items-center bg-surface-card rounded-full px-3 py-1.5 gap-2 border border-surface-light'>
                <Ionicons name='search' size={18} color={'#6B6B70'}/>
                  <TextInput placeholder='Search users'
                  placeholderTextColor={'#6B6B70'}
                  className='flex-1 text-foreground text-sm'
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize='none'
                  />
                  
              </View>
            </View>

            <View className='flex-1 bg-surface'>
              {isCreatingChat || isLoading ? (
                <View className='flex-1 items-center justify-center'>
                  <ActivityIndicator size={'large'} color={'#F4A261'}/>
                </View>
              ): !users ||  users.length === 0 ?(
                <View className='flex-1 items-center justify-center px-5'>
                    <Ionicons name="person-outline"  size={64} color={'#686870'}/>
                    <Text className='text-muted-foreground text-lg mt-4'>
                      No users found
                    </Text>
                    <Text className='text-subtle-foreground text-sm mt-1 text-center'>
                      Try a different search term
                    </Text>
                </View>
              ):(
                <ScrollView
                className='flex-1 px-5 pt-4'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom:24}}
                >
                  <Text className='text-muted-foreground text-sm mb-3'>USERS</Text>
                  {users?.map((user)=>(
                   <UserItems
                   key={user._id}
                   user={user}
                   isOnline={onlineUsers.has(user._id)}
                   onPress = {()=>handleUserSelect(user)}
                   />
                  ))}
                </ScrollView>
              )}
            </View>
        </View>
     </View>
    </SafeAreaView>
  )
}

export default NewChatScreen