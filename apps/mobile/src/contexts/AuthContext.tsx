import { createContext, ReactNode, useEffect, useState } from "react";

import { socketService } from "../services/socketService";

import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  username: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: ({
    newToken,
    newUser,
  }: {
    newToken: string;
    newUser: User;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        socketService.connect(storedToken);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async ({
    newToken,
    newUser,
  }: {
    newToken: string;
    newUser: User;
  }) => {
    await AsyncStorage.setItem("token", newToken);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
    socketService.connect(newToken);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);

    setToken(null);

    setUser(null);

    socketService.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
