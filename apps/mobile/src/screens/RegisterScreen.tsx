import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { registerUser } from "../services/authServices";
import { useAuth } from "../hooks/useAuth";
import { AuthStackParamList } from "../navigation/types";
import { getErrorMessage } from "../utils/getErrorMessage";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export const RegisterScreen = ({ navigation }: Props) => {
  const { login } = useAuth();

  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required");
      return false;
    }
    if (username.trim().length < 3) {
      Alert.alert("Validation Error", "Username must be at least 3 characters");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Validation Error", "Password is required");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Validation Error", "Password must be at least 6 characters");
      return false;
    }
    if (!confirmPassword.trim()) {
      Alert.alert("Validation Error", "Confirm password is required");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (loading) return;

    const isValid = validateForm();
    if (!isValid) return;

    try {
      setLoading(true);
      const response = await registerUser(username.trim(), password);
      await login({
        newToken: response.data.token,
        newUser: response.data.user,
      });
    } catch (error: any) {
      console.log("REGISTER ERROR:", error);
      Alert.alert("Registration Failed", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join and start messaging instantly</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#A1A1AA"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          editable={!loading}
          autoFocus
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />

        <TextInput
          ref={passwordInputRef}
          placeholder="Password"
          placeholderTextColor="#A1A1AA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          editable={!loading}
          onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
        />

        <TextInput
          ref={confirmPasswordInputRef}
          placeholder="Confirm Password"
          placeholderTextColor="#A1A1AA"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          editable={!loading}
          onSubmitEditing={handleRegister}
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          disabled={loading}>
          <Text style={styles.linkText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "#FAFAFC", // Matches Login Screen canvas background
  },
  headerContainer: {
    marginBottom: 36,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#09090B",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 22,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "#F1F1F4", // Seamless surface inputs
    borderRadius: 14, // Consistent squircle curvature
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#09090B",
  },
  primaryButton: {
    backgroundColor: "#6366F1", // Indigo core color
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#A5A6F6",
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
});
