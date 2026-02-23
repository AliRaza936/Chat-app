import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Chat } from '@/types';

import { useSocketStore } from '@/libs/socket';
import { useAPi } from '@/libs/axios';

type UseChatsOptions = {
  subscribeToUpdates?: boolean; // optional real-time subscription
};

export const useChats = ({ subscribeToUpdates }: UseChatsOptions = {}) => {
  const { apiWithAuth } = useAPi();
  const queryClient = useQueryClient();
  const { socket } = useSocketStore(); // your socket connection

  const query = useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data } = await apiWithAuth<Chat[]>({ method: 'GET', url: '/chats' });
      return data;
    },
  });

  // ✅ Subscribe to real-time chat updates
  useEffect(() => {
    if (!subscribeToUpdates || !socket) return;

    const handleNewMessage = (updatedChat: Chat) => {
      queryClient.setQueryData<Chat[]>(['chats'], (oldChats = []) => {
        // Replace the chat if exists, otherwise add new chat
        const index = oldChats.findIndex(c => c._id === updatedChat._id);
        if (index !== -1) {
          const newChats = [...oldChats];
          newChats[index] = updatedChat;
          return newChats;
        }
        return [updatedChat, ...oldChats];
      });
    };

    socket.on('chat:newMessage', handleNewMessage);

    return () => {
      socket.off('chat:newMessage', handleNewMessage);
    };
  }, [subscribeToUpdates, socket, queryClient]);

  return query;
};

export const useGetOrCreateChat = ()=>{
        const {apiWithAuth} = useAPi()
        const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async(participantId:string)=>{
            const {data} = await apiWithAuth<Chat>({
                method:'POST',
                url:`/chats/with/${participantId}`
            })
            return data
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey:['chats']})
        }
    })
}