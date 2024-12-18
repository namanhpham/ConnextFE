"use client";

import React, { createContext, useEffect, useState } from "react";
import { initializeSocket, disconnectSocket, Socket } from "../utils/socket";
import { AuthContext } from "./AuthContext"; // Import AuthContext

interface SocketContextValue {
  socket: Socket | null;
  onMessage: (callback: (message: any) => void) => void;
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  onMessage: () => {},
});

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = React.useContext(AuthContext); // Get user from AuthContext

  useEffect(() => {
    if (user && user.accessToken) {
      // User is logged in, initialize socket
      const newSocket = initializeSocket(user.accessToken);
      setSocket(newSocket);
    } else {
      // User is logged out, disconnect socket
      disconnectSocket();
      setSocket(null);
    }

    return () => {
      disconnectSocket();
      setSocket(null);
    };
  }, [user]); // Re-run effect when 'user' changes

  const onMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on("onMessage", callback);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, onMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
