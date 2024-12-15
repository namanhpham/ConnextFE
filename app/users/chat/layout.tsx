"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, Drawer } from "antd";
import Link from "next/link";
import { users } from "../mockData";
import { useDrawer } from "@/app/context/DrawerContext";
import { authLogout } from "@/app/api/apiService";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { MessageOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons"; // Import icons

const { Sider, Content } = Layout;

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAvatarUrl = localStorage.getItem("avatarUrl");
    setAvatarUrl(storedAvatarUrl);
  }, []);

  const handleLogout = async () => {
    try {
      await authLogout();
      localStorage.clear();
      // Redirect to sign-in page
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={handleProfileClick}>Profile Settings</Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="h-screen text-black">

      {/* Sidebar for larger screens */}
      <Sider breakpoint="md" collapsedWidth="0" className="bg-accent hidden md:block" width={250}>
        <div className="text-xl font-bold p-4">Chats</div>
        <Menu
          theme="dark"
          mode="inline"
          className="bg-accent"
          items={users.map((user) => ({
            key: user.id,
            label: (
              <Link href={`/users/chat/${user.id}`}>
                <div className="flex items-center space-x-2">
                  <Avatar>{user.name.charAt(0)}</Avatar>
                  <div className="">
                    <span className="text-textGray block truncate">{user.name}</span>
                  </div>
                </div>
              </Link>
            ),
          }))}
        />
      </Sider>

      {/* Drawer for smaller screens */}
      <Drawer
        title="Chats"
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        className="md:hidden"
      >
        <Menu
          theme="light"
          mode="inline"
          items={users.map((user) => ({
            key: user.id,
            label: (
              <Link href={`/users/${user.id}`} onClick={() => setIsDrawerOpen(false)}>
                <div className="flex items-center space-x-2">
                  <Avatar>{user.name.charAt(0)}</Avatar>
                  <div className="flex-1">
                    <span className="text-textGray font-semibold block truncate">{user.name}</span>
                  </div>
                </div>
              </Link>
            ),
          }))}
        />
      </Drawer>

      {/* Main Layout */}
      <Layout>
        {/* Main Content */}
        <Content className="overflow-y-auto">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default ChatLayout;
