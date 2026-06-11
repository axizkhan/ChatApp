import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native";

import { useAuth } from "../hooks/useAuth";

export const ChatScreen = () => {
  const { logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text>Chat Screen</Text>
      <Button
        title="Logout"
        onPress={logout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
