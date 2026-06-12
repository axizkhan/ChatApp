import { StyleSheet, Text, View } from "react-native";

export const EmptyChat = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>💬</Text>

      <Text style={styles.title}>No messages yet</Text>

      <Text style={styles.subtitle}>
        Start the conversation by sending your first message.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 80,
  },

  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
});
