import { NavigationContainer } from "@react-navigation/native";

import { SplashScreen } from "../screens/SplashScreen";

import { AppNavigator } from "./AppNavigator";
import { AuthNavigator } from "./AuthNavigator";

import { useAuth } from "../hooks/useAuth";

export const RootNavigator = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
