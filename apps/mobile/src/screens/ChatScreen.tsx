// ChatScreen.tsx
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Keyboard,
  Text,
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
import { KeyboardSafeView } from "../layout/KeyboardSafeView";
import { useRef, useEffect, useState, useCallback } from "react";

export const ChatScreen = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [socketStatus, setSocketStatus] = useState<
    "connected" | "disconnected" | "reconnecting"
  >("connected");
  const [typingUsers, setTypingUsers] = useState<
    { userId: string; username: string }[]
  >([]);
  const flatListRef = useRef<FlatList>(null);
  const typingTimer = useRef<NodeJS.Timeout>(null);
  const insets = useSafeAreaInsets();
  const initialBottomInset = useRef(insets.bottom).current;

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
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    socketService.on("connect", () => setSocketStatus("connected"));
    socketService.on("disconnect", () => setSocketStatus("disconnected"));
    socketService.on("reconnect_attempt", () =>
      setSocketStatus("reconnecting"),
    );

    socketService.on(
      SOCKET_EVENTS.USER_TYPING,
      (payload: { userId: string; username: string; isTyping: boolean }) => {
        setTypingUsers((prev) => {
          if (payload.isTyping) {
            if (!prev.find((u) => u.userId === payload.userId)) {
              return [
                ...prev,
                { userId: payload.userId, username: payload.username },
              ];
            }
            return prev;
          } else {
            return prev.filter((u) => u.userId !== payload.userId);
          }
        });
      },
    );

    // Auto scroll to bottom when keyboard opens
    const kbSub = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    });

    return () => {
      socketService.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
      socketService.off("connect");
      socketService.off("disconnect");
      socketService.off("reconnect_attempt");
      socketService.off(SOCKET_EVENTS.USER_TYPING);
      kbSub.remove();
    };
  }, []);

  const handleTyping = () => {
    if (!typingTimer.current) {
      socketService.emit(SOCKET_EVENTS.START_TYPING);
    } else {
      clearTimeout(typingTimer.current);
    }
    typingTimer.current = setTimeout(() => {
      socketService.emit(SOCKET_EVENTS.STOP_TYPING);
      typingTimer.current = null;
    }, 1000);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      text,
      senderId: user?.id || "",
      senderName: user?.username || "",
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    socketService.emit(
      SOCKET_EVENTS.SEND_MESSAGE,
      { text },
      (response: any) => {
        if (response.success && response.message) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === tempId
                ? { ...response.message, status: "sent" }
                : msg,
            ),
          );
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id === tempId ? { ...msg, status: "failed" } : msg,
            ),
          );
        }
      },
    );
  };

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble
        message={item}
        isOwnMessage={item.senderId === user?.id}
      />
    ),
    [user?.id],
  );

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

      {/* Header OUTSIDE keyboard handling */}
      <ChatHeader onLogout={logout} />
      <ConnectionStatusComp status={socketStatus} />

      <KeyboardSafeView style={styles.keyboardAvoider}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id as string}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContainer}
          ListEmptyComponent={<EmptyChat />}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />

        {typingUsers.length > 0 && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>
              {typingUsers.map((u) => u.username).join(", ")}{" "}
              {typingUsers.length === 1 ? "is" : "are"} typing...
            </Text>
          </View>
        )}
        <View style={styles.inputContainer}>
          <MessageInput
            onSend={handleSendMessage}
            onTyping={handleTyping}
          />
        </View>
      </KeyboardSafeView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },

  keyboardAvoider: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFC",
  },

  chatContainer: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingBottom: 8,
  },

  inputContainer: {
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },

  typingIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  typingText: {
    fontSize: 12,
    color: "#64748B",
    fontStyle: "italic",
  },
});
