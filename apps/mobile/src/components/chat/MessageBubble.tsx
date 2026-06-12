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
      {/* Sender Name only shows up above external messages */}
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
          {/* Invisible spacer string ensures text doesn't overlap the absolute timestamp */}
          <Text style={styles.timeSpacer}>{"      "}</Text>
        </Text>

        <Text
          style={[
            styles.time,
            isOwnMessage ? styles.ownTime : styles.otherTime,
          ]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
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
    color: "#64748B", // Soft neutral slate
    marginLeft: 8,
    marginBottom: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    position: "relative", // Anchors our absolute timestamp seamlessly
    minWidth: 64,
  },
  ownBubble: {
    backgroundColor: "#6366F1", // Brand Indigo token
    // Premium asymmetric squircle radius: drops sharply at the bottom right corner
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#F1F1F4", // Seamless surface tint token
    // Drops sharply at the bottom left corner
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 18,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  ownText: {
    color: "#FFFFFF",
  },
  otherText: {
    color: "#09090B", // High-contrast ink
  },
  timeSpacer: {
    fontSize: 11,
  },
  time: {
    fontSize: 10,
    position: "absolute",
    bottom: 6,
    right: 12,
  },
  ownTime: {
    color: "rgba(255, 255, 255, 0.65)", // Semitransparent white to prevent high contrast fatigue
  },
  otherTime: {
    color: "#A1A1AA", // Muted structural gray
  },
});
