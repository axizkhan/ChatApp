import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "@chat-app/shared/src/types/message";

interface Props {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble = ({ message, isOwnMessage }: Props) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={[
        styles.wrapper,
        isOwnMessage ? styles.wrapperRight : styles.wrapperLeft,
      ]}>
      {/* Sender Name */}
      {!isOwnMessage && message.senderName && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}

      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}>
        <Text
          style={[
            styles.messageText,
            isOwnMessage ? styles.ownText : styles.otherText,
          ]}>
          {message.text}

          {/* Horizontal spacing for timestamp */}
          <Text style={styles.timeSpacer}>{"      "}</Text>
        </Text>

        <Text
          style={[
            styles.time,
            isOwnMessage ? styles.ownTime : styles.otherTime,
          ]}>
          {formattedTime}{" "}
          {isOwnMessage && message.status === "sending" && "🕒"}
          {isOwnMessage && message.status === "sent" && "✓"}
          {isOwnMessage && message.status === "failed" && "⚠️"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    paddingHorizontal: 16,
    maxWidth: "85%",
  },

  wrapperLeft: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },

  wrapperRight: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },

  senderName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
    marginLeft: 8,
    marginBottom: 4,
  },

  bubble: {
    paddingHorizontal: 16,
    paddingTop: 10,

    // Extra bottom padding creates breathing room
    // between message text and timestamp
    paddingBottom: 18,

    position: "relative",
    minWidth: 64,
  },

  ownBubble: {
    backgroundColor: "#6366F1",

    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },

  otherBubble: {
    backgroundColor: "#F1F1F4",

    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,

    // Vertical breathing room
    marginBottom: 0,

    letterSpacing: -0.1,
  },

  ownText: {
    color: "#FFFFFF",
  },

  otherText: {
    color: "#09090B",
  },

  // Horizontal spacing so text doesn't hit timestamp
  timeSpacer: {
    fontSize: 11,
  },

  time: {
    fontSize: 10,

    position: "absolute",

    // Slightly lower for better visual balance
    bottom: 6,
    right: 12,
  },

  ownTime: {
    color: "rgba(255,255,255,0.65)",
  },

  otherTime: {
    color: "#A1A1AA",
  },
});
