import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

// Optional: If you use an icon library like expo-vector-icons or react-native-vector-icons,
// you can replace this placeholder with a real feather/lucide icon like <Feather name="log-out" size={20} color="#64748B" />
const LogOutIcon = () => (
  <View style={styles.iconPlaceholder}>
    <View style={styles.iconArrow} />
    <View style={styles.iconBar} />
  </View>
);

interface Props {
  onLogout: () => void;
}

export const ChatHeader = ({ onLogout }: Props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Messages</Text>
          <View style={styles.statusIndicator} />
        </View>

        <TouchableOpacity
          onPress={onLogout}
          style={styles.actionButton}
          activeOpacity={0.7}>
          <LogOutIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // Ensures background color transparency plays nicely with the status bar
    backgroundColor: "#FAFAFC",
  },
  container: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Glassmorphism base tint
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)", // Ultra-faint line separator

    // Platform-specific styling for native polish
    ...Platform.select({
      ios: {
        // Works out of the box if parent containers allow backdrop filters
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 0,
      },
      android: {
        backgroundColor: "#FFFFFF", // Fallback to solid crisp white on Android
        elevation: 2,
      },
    }),
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#09090B", // High-contrast structural ink
    letterSpacing: -0.4,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981", // Emerald online dot nested right in the header
    marginLeft: 8,
    marginTop: 4,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F1F4", // Muted button container
    alignItems: "center",
    justifyContent: "center",
  },

  // Quick styling placeholders to render a minimal log out icon shape
  iconPlaceholder: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  iconArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: "#64748B",
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    right: 2,
  },
  iconBar: {
    width: 12,
    height: 2,
    backgroundColor: "#64748B",
    position: "absolute",
    left: 2,
  },
});
