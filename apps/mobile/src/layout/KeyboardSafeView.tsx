import React, { useEffect, useRef } from "react";

import { Animated, Keyboard, Platform, ViewStyle } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const KeyboardSafeView = ({ children, style }: Props) => {
  const insets = useSafeAreaInsets();
  const initialBottomInset = useRef(insets.bottom).current;
  const paddingBottom = useRef(new Animated.Value(initialBottomInset)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const keyboardHeight = event.endCoordinates.height;
      // Android keyboard height in edge-to-edge often misses the navigation bar height
      const offset = Platform.OS === "android" ? 34 : 0;

      Animated.timing(paddingBottom, {
        toValue: keyboardHeight + offset,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      Animated.timing(paddingBottom, {
        toValue: initialBottomInset,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [initialBottomInset]);

  return (
    <Animated.View
      style={[
        style,
        {
          paddingBottom,
        },
      ]}>
      {children}
    </Animated.View>
  );
};
