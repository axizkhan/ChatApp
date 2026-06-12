import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../theme/colors";

export const EmptyChat = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No messages yet.</Text>
      <Text style={styles.subtitle}>Start the conversation 🚀</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
});
