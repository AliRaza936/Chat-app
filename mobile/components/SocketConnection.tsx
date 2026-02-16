import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useQueryClient } from '@tanstack/react-query'
import { useSocketStore } from '@/libs/socket'

const SocketConnection = () => {
    const {getToken ,isSignedIn} = useAuth()
    const queryClient = useQueryClient()
    const connect = useSocketStore((state)=>state.connect)
    const disconnect = useSocketStore((state)=>state.disconnect)
    useEffect(()=>{
        if(isSignedIn){
            getToken().then((token)=>{
                if(token) connect(token,queryClient)
            })
        }else{ disconnect}
    },[isSignedIn, connect,disconnect, getToken, queryClient])
  return null
}

export default SocketConnection