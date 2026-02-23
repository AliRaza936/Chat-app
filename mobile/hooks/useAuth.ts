import { useAPi } from "@/libs/axios"
import { AuthCallbackResponse, User } from "@/types"
import {  useMutation, useQuery } from "@tanstack/react-query"


export const useAuthCallback = ()=>{
    const {apiWithAuth} = useAPi()
    
     return useMutation<AuthCallbackResponse, unknown, string>({
    // mutationFn takes idToken as argument
    mutationFn: async (idToken: string) => {
      const { data } = await apiWithAuth<AuthCallbackResponse>({
        method: "POST",
        url: "/auth/callback",
        data: { idToken },
      });
      return data;
    },
  });
}

export const useCurrentUser = () => {
  const { apiWithAuth } = useAPi();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await apiWithAuth<User>({
        method: "GET",
        url: "/auth/me",
      });
      return data;
    },
    enabled: true,
  });
};