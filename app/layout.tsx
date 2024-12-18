import React from 'react';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConfigProvider } from 'antd';
import AuthProvider from './context/AuthContext';
import { DrawerProvider } from './context/DrawerContext';
import SocketProvider from './context/SocketContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Chat and video call with your friends',
}

const theme = {
  components: {
    Button: {
      colorPrimary: '#19b3a8',
      colorSecondary: '#F0F0F0',
      colorPrimaryHover: '#17a39b', // Custom hover color for primary buttons
      colorSecondaryHover: '#e6e6e6', // Custom hover color for secondary buttons
      colorPrimaryActive: '#17a39b', // Custom active color for primary buttons
      colorSecondaryActive: '#e6e6e6', // Custom active color for secondary buttons
    },
    Menu: {
      colorPrimary: '#19b3a8',
      colorSecondary: '#F0F0F0',
    }
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SocketProvider>
            <DrawerProvider>
              <ConfigProvider theme={theme}>
                {children}
              </ConfigProvider>
            </DrawerProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
