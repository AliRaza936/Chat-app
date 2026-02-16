import { useAuthCallback } from "@/hooks/useAuth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useRef } from "react";
import * as Sentry from '@sentry/react-native';
import { useSocketStore } from "@/libs/socket";

const AuthSync = () => {
  const { isSignedIn } = useAuth();

  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();
  const hasSync = useRef(false);

  const {} = useSocketStore()
    useEffect(()=>{
        if(isSignedIn && user && !hasSync.current){
            hasSync.current = true
            syncUser(undefined,{
                onSuccess:(data)=>{
                    console.log("✅ User synced with backend:",data.name)
                    Sentry.logger.info(Sentry.logger.fmt`User synced with backend: ${data.name}`,{
                        userId:user.id,
                        userName:data.name,
                    })
                },
                onError:(error)=>{
                    console.log("❌ User sync failed:",error.name)
                    Sentry.logger.error(Sentry.logger.fmt`User sync failed with backend`,{
                        userId:user.id,
                        error:error instanceof Error ? error.message :String(error),
                    })
                },
            })
        }
        if(!isSignedIn){
            hasSync.current = false
        }
    },[isSignedIn,user,syncUser])


  return null;
};

export default AuthSync;
