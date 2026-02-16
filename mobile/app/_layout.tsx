import { Stack } from "expo-router";
import "../global.css"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import AuthSync from "@/components/AuthSync";

import { StatusBar } from "expo-status-bar";
import * as Sentry from '@sentry/react-native';
import { View } from "react-native";
import SocketConnection from "@/components/SocketConnection";

Sentry.init({
  dsn: 'https://d491c1b469cbf9d67d7bebeb2fa3c370@o4510878132469760.ingest.de.sentry.io/4510878140923984',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration(),

    Sentry.reactNativeTracingIntegration({
      traceFetch:true,
      traceXHR:true,
      enableHTTPTimings:true
    })
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient()
export default Sentry.wrap(function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0D0D0F" }}>

     <ClerkProvider tokenCache={tokenCache} >
      <QueryClientProvider client={queryClient}>
        <AuthSync/>
        <SocketConnection/>
        <StatusBar style="light"/>
      <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:"#0D0D0F"}}}>
        <Stack.Screen name="(auth)" options={{animation:'fade'}}/>
        <Stack.Screen name="(tabs)" options={{animation:'fade'}}/>
        <Stack.Screen name="new-chat" options={{animation:'slide_from_bottom',
          presentation:'modal',
          gestureEnabled:true,
        }}/>
      </Stack>
    </QueryClientProvider>
     </ClerkProvider>
    </View>
    
  );
});