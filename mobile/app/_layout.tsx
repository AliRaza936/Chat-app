import { Stack, useRouter } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from "expo-status-bar";
import * as Sentry from '@sentry/react-native';
import { ActivityIndicator, View } from "react-native";
import SocketConnection from "@/components/SocketConnection";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
import AppSplash from "@/components/AppSplash";

const queryClient = new QueryClient();
const API_URL = "http://192.168.100.90:3000";
export default (function RootLayout() {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [serverReady, setServerReady] = useState(false);

  const router = useRouter();

  // ✅ auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setIsSignedIn(!!token);
      } catch {
        setIsSignedIn(false);
      }
    };
    checkAuth();
  }, []);

  // ✅ server health check
  useEffect(() => {
    const isServerConnect = async () => {
      try {
        const result = await axios.get(`${API_URL}/health`);
        if (result?.data?.status === "ok") {
          setServerReady(true);
        }
      } catch (e) {
        console.log(API_URL,'asdas')
        console.log(e);
        setServerReady(false);
      }
    };

    isServerConnect();
  }, []);

  // ✅ navigation
  useEffect(() => {
    if (!serverReady) return; // wait server

    if (isSignedIn === true) {
      router.replace("/(tabs)");
    } else if (isSignedIn === false) {
      router.replace("/(auth)");
    }
  }, [isSignedIn, serverReady]);

  // ✅ splash loader until BOTH ready
 if (isSignedIn === null || !serverReady) {
  const message =
    isSignedIn === null
      ? "Checking authentication..."
      : "Connecting to server, please wait...";

  return <AppSplash message={message} />;
}

  return (
    <QueryClientProvider client={queryClient}>
      <SocketConnection />
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0D0D0F" },
        }}
      >
        <Stack.Screen
          name="new-chat"
          options={{
            animation: "slide_from_bottom",
            presentation: "modal",
            gestureEnabled: true,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
});