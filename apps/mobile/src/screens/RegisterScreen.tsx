import { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
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
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>Register to continue</Text>

      <TextInput
        placeholder="Username"
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

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button
            title="Register"
            onPress={handleRegister}
          />
        )}
      </View>

      <View style={styles.spacer} />

      <Button
        title="Already have an account?"
        onPress={() => navigation.navigate("Login")}
        disabled={loading}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },

  input: {
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 16,
    fontSize: 16,
  },

  buttonContainer: {
    marginTop: 8,
  },

  spacer: {
    height: 16,
  },
});
