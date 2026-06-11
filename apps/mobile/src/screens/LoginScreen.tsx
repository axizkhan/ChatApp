import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";
import { AuthStackParamList } from "../navigation/types";
import { useAuth } from "../hooks/useAuth";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button
        title="Go To Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button
        title="Fake Login"
        onPress={() => login("test-token")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
