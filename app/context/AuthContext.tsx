'use client'

import React, { createContext, useEffect, useState, useContext } from "react"
import { pingServer } from "../api/utils/pingServerService";

interface AuthProviderProps {
    children: React.ReactNode
}

interface User {
  username: string;
  email: string;
  role: string;
  nickName: string;
  userId: string;
  accessToken: string;
  avatarUrl: string;
}

interface AuthContextValue  {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => { },
  isLoading: false,
  setIsLoading: function (isLoading: boolean): void{},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load user info from localStorage on mount
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const storedUser: User = {
        username: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
        role: localStorage.getItem("role") || "",
        nickName: localStorage.getItem("nickName") || "",
        userId: localStorage.getItem("userId") || "",
        avatarUrl: localStorage.getItem("avatarUrl") || "",
        accessToken,
      };
      setIsLoading(false);
      setUser(storedUser);
      localStorage.setItem("user", JSON.stringify(storedUser));
      
      // Start pinging the server every 10 seconds
      const intervalId = setInterval(pingServer, 10000);

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
