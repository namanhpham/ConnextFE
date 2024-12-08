import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ConfigProvider } from 'antd';
import AuthProvider from './context/AuthContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Chat and video call with your friends',
}

const theme = {
  components: {
    Button: {
      colorPrimary: '#F7E7D4',
      colorSecondary: '#F4C7C3',
    },
    Menu: {
      colorPrimary: '#F4C7C3',
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
          <ConfigProvider theme={theme}>
            {children}
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
