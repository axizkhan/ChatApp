import { useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { socketService } from "../services/socketService";
import { SOCKET_EVENTS } from "@chat-app/shared/src/socket/event";
export const ChatScreen = () => {
  const { logout } = useAuth();
  useEffect(() => {
    socketService.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (message) => {
      console.log("New message:", message);
    });
    return () => {
      socketService.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
    };
  }, []);
  const sendTestMessage = () => {
    socketService.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      text: "Hello realtime world",
    });
  };
  return (
    <View style={styles.container}>
      <Button
        title="Send Test Message"
        onPress={sendTestMessage}
      />
      <View style={styles.spacer} />
      <Button
        title="Logout"
        onPress={logout}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  spacer: { height: 16 },
});
