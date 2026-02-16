// app/sso-callback.tsx
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const SSOCallback = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {

      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#F4a261" />
    </View>
  );
};

export default SSOCallback;
