// libs/axios.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.100.90:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const useAPi = () => {
  const apiWithAuth = async <T>(config: Parameters<typeof api.request>[0]) => {
    const token = await AsyncStorage.getItem("token"); 
    return api.request<T>({
      ...config,
      headers: { ...config.headers, ...(token && { Authorization: `Bearer ${token}` }) },
    });
  };

  return { api, apiWithAuth };
};

// upper code improve with coderabbit


// // import { useAuth } from "@clerk/clerk-expo"
// import axios from "axios"
// import { useEffect } from "react"
// import * as Sentry from '@sentry/react-native';

// // const API_URL = "http://localhost:3000/api"
// const API_URL = "http://192.168.100.90:3000/api"


// const api = axios.create({
//     baseURL : API_URL,
//     headers:{
//         'Content-Type':"application/json"
//     } 
// })

// export const useAPi = ()=>{
//     const {getToken} = useAuth()

//     useEffect(()=>{
//         const requestInterceptor = api.interceptors.request.use(async(config)=>{
//             const token = await getToken()
//             if(token){
//                 config.headers.Authorization = `Bearer ${token}`
//             }
//             return config
//         })
//         const responseInterceptor = api.interceptors.response.use((response)=>response,
//         (error)=>{
//             // log error to sentry
//             if(error.response){
//                 Sentry.logger.error(
//                     Sentry.logger.fmt`API request failed: ${error.config.method?.toUpperCase()} ${error.config.url}`,
//                     {
//                         status: error.response.status,
//                         endpoint: error.config?.url,
//                         method: error.config?.method,
//                     }
//                 )
//             } else if(error.message){
//                 Sentry.logger.warn("Api request error without response",{
//                     endpoint:error.config?.url,
//                     method:error.config?.method,
//                 })
//             }
//             return Promise.reject(error)
            
//         })
//         return ()=>{
//             api.interceptors.request.eject(requestInterceptor)
            // api.interceptors.response.eject(responseInterceptor)
//         }   
//     },[getToken])
//     return api
// }
