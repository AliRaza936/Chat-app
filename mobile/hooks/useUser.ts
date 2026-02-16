import { useAPi } from "@/libs/axios"
import { User } from "@/types"
import { useQuery } from "@tanstack/react-query"


export const useUsers =()=>{
    const {apiWithAuth} = useAPi()
    return useQuery({
        queryKey:['users'],
        queryFn: async()=>{
            const {data} = await apiWithAuth<User[]>({method:"GET",url:'/users'})
            return data
        }
    })
}