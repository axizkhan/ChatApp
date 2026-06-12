import { useState } from "react";
import { COLORS } from "../../theme/colors";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

interface Props {
  onSend: (text: string) => void;
  onTyping?: () => void;
}

const SendArrowIcon = ({ isActive }: { isActive: boolean }) => (
  <View style={[styles.arrowWrapper, isActive && styles.arrowWrapperActive]}>
    <View style={[styles.arrowHead, isActive && styles.arrowHeadActive]} />
    <View style={[styles.arrowShaft, isActive && styles.arrowShaftActive]} />
  </View>
);

export const MessageInput = ({ onSend, onTyping }: Props) => {
  const [text, setText] = useState("");
  const isInputEmpty = !text.trim();

  const handleTextChange = (newText: string) => {
    setText(newText);
    if (onTyping) {
      onTyping();
    }
  };

  const handleSend = () => {
    if (isInputEmpty) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          placeholder="Message..."
          placeholderTextColor={COLORS.textPlaceholder}
          style={styles.input}
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={[styles.button, isInputEmpty && styles.buttonDisabled]}
          activeOpacity={0.7}
          disabled={isInputEmpty}>
          <SendArrowIcon isActive={!isInputEmpty} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 24 : 16,
    paddingTop: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,

    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "ios" ? 8 : 6,
    paddingBottom: Platform.OS === "ios" ? 8 : 6,
    maxHeight: 100,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: COLORS.surfaceVariant,
  },

  arrowWrapper: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-45deg" }],
    marginLeft: -2,
    marginTop: -1,
  },
  arrowWrapperActive: {
    transform: [{ rotate: "0deg" }],
  },
  arrowHead: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.textPlaceholder,
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    top: 0,
  },
  arrowHeadActive: {
    borderColor: COLORS.textInverse,
  },
  arrowShaft: {
    width: 2,
    height: 10,
    backgroundColor: COLORS.textPlaceholder,
    position: "absolute",
    bottom: 0,
  },
  arrowShaftActive: {
    backgroundColor: COLORS.textInverse,
  },
});
