import { View, Text, Image, ActivityIndicator } from "react-native";

export default function AppSplash({ message }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-surface-dark px-6">

      {/* Logo container (important) */}
      <View className="w-28 h-28 mb-6 items-center justify-center">
        <Image
          source={require("@/assets/images/logo.png")}
          className="w-full h-full"
          resizeMode="contain"
        />
      </View>

      <Text className="text-foreground text-2xl font-semibold mb-2">
        Just Chat
      </Text>

      <Text className="text-muted-foreground text-sm mb-6 text-center">
        {message ?? "Starting app..."}
      </Text>

      <ActivityIndicator size="large" color="#F4A261" />
    </View>
  );
}