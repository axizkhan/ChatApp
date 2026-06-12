import { StyleSheet, Text, View, Platform } from "react-native";
import { ConnectionStatus } from "../../types/socket";

interface Props {
  status: ConnectionStatus;
}

export const ConnectionStatusComp = ({ status }: Props) => {
  // If fully connected, we keep the UI clean and invisible.
  // It will slide/render into view only during disruptions.
  if (status === "connected") return null;

  const getConfig = () => {
    switch (status) {
      case "connecting":
        return {
          label: "Connecting to network...",
          dotColor: "#F59E0B", // Soft Amber
          bgColor: "rgba(245, 158, 11, 0.08)",
          textColor: "#D97706",
        };
      case "reconnecting":
        return {
          label: "Connection lost. Reconnecting...",
          dotColor: "#EF4444", // Soft Coral / Red
          bgColor: "rgba(239, 68, 68, 0.08)",
          textColor: "#DC2626",
        };
      default:
        return {
          label: "Offline. Check your connection.",
          dotColor: "#6B7280", // Muted Gray
          bgColor: "rgba(107, 114, 128, 0.08)",
          textColor: "#4B5563",
        };
    }
  };

  const config = getConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor }]}>
      <View style={styles.content}>
        <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
        <Text style={[styles.text, { color: config.textColor }]}>
          {config.label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.03)", // Whisper-thin boundary
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
    }),
  },
  text: {
    fontSize: 13,
    fontWeight: "600", // Semi-bold for clear data readouts
    letterSpacing: -0.1,
  },
});
