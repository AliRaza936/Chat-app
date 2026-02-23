import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "@/libs/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SocketConnection = () => {
  const queryClient = useQueryClient();
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);

useEffect(() => {
  let isMounted = true;

  const initSocket = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token && isMounted) {
      connect(token, queryClient);
    } else if (isMounted) {
      disconnect();
    }
  };

  initSocket();

  return () => {
    isMounted = false;
    disconnect();
  };
}, [connect, disconnect, queryClient]);

  return null; 
};

export default SocketConnection;