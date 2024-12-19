'use client'

import React, { createContext, useEffect, useState, useContext } from "react"

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

interface AuthContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

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
      setUser(storedUser);
      localStorage.setItem("user", JSON.stringify(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
