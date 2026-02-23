import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.replace("/(tabs)"); // Already signed in → go to tabs
      } else {
        setLoading(false); // Show login
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0D0D0F" }}>
        <ActivityIndicator size="large" color="#F4A261" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}