import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/logo.png";
import auth from "../../assets/images/auth.png";
import google from "../../assets/images/google.png";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import useAuthSocial from "@/hooks/useSocialAuth";
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedOrb } from "@/components/AnimatedOrb";
import {BlurView} from "expo-blur"

const { width, height } = Dimensions.get("window");
const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useAuthSocial();
  const isLoading = loadingStrategy !== null;
  return (
    <View className="bg-surface-dark  flex-1">
      <View className="absolute inset-0 overflow-hidden">
        <LinearGradient 
        colors={['#0D0D0F',"#1A1A2E","#16213E","#0D0D0F"]}
        style={{position:'absolute',width:"100%",height:'100%'}}
        start={{x:0,y:0}}
        end={{x:1,y:1}}
        />
        <AnimatedOrb 
        colors={['#F4A261',"#E76F51"]}
        size={300}
        initialX={-80}
        initialY={height * 0.1}
        duration={4000}
        />
        <AnimatedOrb 
        colors={['#F4A261',"#E76F51"]}
        size={250}
        initialX={width - 100}
        initialY={height * 0.3}
        duration={5000}
        />
        <AnimatedOrb 
        colors={['#F4A261',"#E76F51"]}
        size={200}
        initialX={width * 0.3}
        initialY={height * 0.6}
        duration={3500}
        />
        <AnimatedOrb 
        colors={['#F4A261',"#E76F51"]}
        size={180}
        initialX={-50}
        initialY={height * 0.75}
        duration={4500}
        />
        <BlurView
        intensity={50}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={{position:'absolute',width:'100%',height:"100%"}}
        />
      </View>
        <SafeAreaView className="flex-1">

         
          <View className="items-center pt-10">
            <Image
              source={logo}
              style={{ width: 100, height: 100, marginVertical: -20 }}
              contentFit="contain"
            />
            <Text className="text-primary text-4xl font-bold uppercase font-serif tracking-wider ">
              Just Chat
            </Text>
          </View>

          <View className="flex-1 justify-center items-center px-6">
            <Image
              source={auth}
              style={{ width: width - 48, height: height * 0.3 }}
              contentFit="contain"
            />

            <View className="mt-6 items-center">
              <Text className="text-5xl font-bold text-foreground text-center font-serif">
                Connect & Chat
              </Text>
              <Text className="text-3xl font-bold text-primary text-center font-serif ">
                Seamlessly
              </Text>
            </View>

            <View className="flex-col gap-4 w-full mt-10">
              <Pressable
                className="flex-row items-center justify-center gap-2 bg-white/95 py-4 rounded-2xl active:scale-[0.97]"
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
                onPress={() => !isLoading && handleSocialAuth("oauth_google")}
              >
                {loadingStrategy === "oauth_google" ? (
                  <ActivityIndicator size="small" color="#1a1a1a" />
                ) : (
                  <>
                    <Image
                      source={google}
                      style={{ width: 20, height: 20 }}
                      contentFit="contain"
                    />
                    <Text className="text-gray-900  font-semibold">
                      Continue with Google
                    </Text>
                  </>
                )}
              </Pressable>

              {/* <Pressable
                className="flex-row  items-center justify-center gap-2 bg-white/95 py-4 rounded-2xl active:scale-[0.97]"
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Continue with apple"
                onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
              >
                {loadingStrategy === "oauth_apple" ? (
                  <ActivityIndicator size="small" color="#1a1a1a" />
                ) : (
                  <>
                    <Ionicons name="logo-apple" size={20} color="black" />
                    <Text className="text-gray-900  font-semibold">
                      Continue with Apple
                    </Text>
                  </>
                )}
              </Pressable> */}
            </View>
          </View>
        </SafeAreaView>
      
    </View>
  );
};

export default AuthScreen;
