import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";

export default function AuthSync() {
//   const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

//  useEffect(() => {
//   const checkAuth = async () => {
   
//       const token = await AsyncStorage.getItem('token');
//       if(token){

//         setIsSignedIn(!!token);
//       }else{
//         setIsSignedIn(false);

//       }
  
//   };

//   checkAuth();
// }, []);

//   if (isSignedIn === null) {
//     return (
//       <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
//         <ActivityIndicator size="large" color="#F4A261" />
//       </View>
//     );
//   }

//   return isSignedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
}