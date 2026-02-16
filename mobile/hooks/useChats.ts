import { useAPi } from "@/libs/axios"
import { Chat } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useChats = ()=>{
    const {apiWithAuth} = useAPi()

    return useQuery({
        queryKey:['chats'],
        queryFn:async():Promise<Chat[]>=>{
                const {data} = await apiWithAuth<Chat[]>({method:'GET',url:'/chats'})
                return data
        }
    })
}

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