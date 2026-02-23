import { Animated, Keyboard, KeyboardAvoidingView, Platform, View } from "react-native";
import { useState, useEffect, PropsWithChildren } from "react";

type ChatInputWrapperProps = PropsWithChildren<{
  onKeyboardShow?: () => void;
}>

export const ChatInputWrapper: React.FC<ChatInputWrapperProps> = ({ children }) => {
  const [keyboardHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Animated.View style={{ flex: 1, paddingBottom: keyboardHeight }}>
        {children}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};



