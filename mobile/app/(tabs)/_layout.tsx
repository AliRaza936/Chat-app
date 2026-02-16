import {Redirect, Tabs } from 'expo-router'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabsLayout = () => {
  const { isSignedIn,isLoaded } = useAuth()
const insets = useSafeAreaInsets();
  if(!isLoaded) return null
  if (!isSignedIn) {
    return <Redirect href={'/(auth)'} />
  }


  return (
    <Tabs
    screenOptions={{
        headerShown:false,
        tabBarStyle:{
            backgroundColor:'#0D0D0F',
            borderTopColor:"#1A1A1D",
            borderTopWidth:1,
             height: 60 + insets.bottom,
            paddingTop:3,

        },
        tabBarActiveTintColor:"#F4a261",
        tabBarInactiveTintColor:"#6B6B70",
        tabBarLabelStyle:{fontSize:12,fontWeight:"600"}
    }}
    >
      <Tabs.Screen 
      name="index"
      options={{
        title:"Chats",
        tabBarIcon:({color,focused,size})=>{
            return <Ionicons name={focused ? "chatbubbles" : "chatbubbles-outline"} size={size} color={color} />
        }
      }}

       />
      <Tabs.Screen 
      name="profile"
      options={{
        title:"Profile",
        tabBarIcon:({color,focused,size})=>{
            return <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
        }
      }}
       />
      
    </Tabs>
  )
}

export default TabsLayout