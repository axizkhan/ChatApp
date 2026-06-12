import React, { useEffect, useRef } from "react";

import { Animated, Keyboard, Platform, ViewStyle } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const KeyboardSafeView = ({ children, style }: Props) => {
  const insets = useSafeAreaInsets();

  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const keyboardHeight = event.endCoordinates.height;

      Animated.timing(translateY, {
        toValue: -(keyboardHeight - insets.bottom),
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY }],
        },
      ]}>
      {children}
    </Animated.View>
  );
};
