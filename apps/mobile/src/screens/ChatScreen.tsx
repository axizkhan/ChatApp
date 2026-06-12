import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../hooks/useAuth";

import { socketService } from "../services/socketService";

import { fetchMessages } from "../services/messageService";

import { SOCKET_EVENTS } from "@chat-app/shared/src/socket/event";

import { Message } from "@chat-app/shared/src/types/message";

import { MessageBubble } from "../components/chat/MessageBubble";

import { MessageInput } from "../components/chat/MessageInput";

import { ChatHeader } from "../components/chat/ChatHeader";

import { ConnectionStatusComp } from "../components/chat/ConnectionStatus";

import { EmptyChat } from "../components/chat/EmptyChat";

export const ChatScreen = () => {
  const { user, logout } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(true);

  const [socketStatus, setSocketStatus] = useState<
    "connected" | "disconnected" | "reconnecting"
  >("connected");

  const flatListRef = useRef<FlatList>(null);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    try {
      setLoading(true);

      const history = await fetchMessages();

      setMessages(history.data);
    } catch (error) {
      console.log("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    socketService.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (message: Message) => {
      setMessages((prev) => [...prev, message]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    });

    socketService.on("connect", () => {
      setSocketStatus("connected");
    });

    socketService.on("disconnect", () => {
      setSocketStatus("disconnected");
    });

    socketService.on("reconnect_attempt", () => {
      setSocketStatus("reconnecting");
    });

    return () => {
      socketService.off(SOCKET_EVENTS.RECEIVE_MESSAGE);

      socketService.off("connect");

      socketService.off("disconnect");

      socketService.off("reconnect_attempt");
    };
  }, []);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    socketService.emit(SOCKET_EVENTS.SEND_MESSAGE, { text });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="small"
          color="#6366F1"
        />
      </View>
    );
  }
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FAFAFC"
      />

      {/* Header OUTSIDE KeyboardAvoidingView */}
      <ChatHeader onLogout={logout} />
      <ConnectionStatusComp status={socketStatus} />

      {/* KeyboardAvoidingView wraps ONLY the chat content */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwnMessage={item.senderId === user?.id}
            />
          )}
          contentContainerStyle={[
            styles.chatContainer,
            { paddingBottom: 8 }, // Space so last message isn't hidden
          ]}
          ListEmptyComponent={<EmptyChat />}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        <View style={styles.inputContainer}>
          <MessageInput onSend={handleSendMessage} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },

  keyboardAvoider: {
    flex: 1, // Takes remaining space below header
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFC",
  },

  chatContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    // paddingBottom handled inline for clarity
  },

  inputContainer: {
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20, // Consistent small padding
  },
});
