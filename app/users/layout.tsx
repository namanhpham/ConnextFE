"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, Drawer, Avatar, Dropdown, Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation
import { users, messages } from "./mockData";
import { useDrawer } from "../context/DrawerContext";
import { authLogout } from "../api/apiService";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { MessageOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons"; // Import icons

const { Sider, Content } = Layout;

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

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

  const getLastMessageTime = (userId: string) => {
    const userMessages = messages[userId];
    if (userMessages && userMessages.length > 0) {
      return new Date().toLocaleTimeString(); // Replace with actual timestamp logic
    }
    return "";
  };

  return (
    <Layout className="h-screen text-black">
      {/* Smaller Sidebar for profile navigation */}
      <Sider width={80} className="bg-primary flex flex-col items-center p-4 border-r">
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <Avatar src={avatarUrl} className="cursor-pointer mb-4" />
        </Dropdown>
        <div className="flex flex-col items-center space-y-4 mt-auto">
          <Button
            type="text"
            icon={<MessageOutlined />}
            onClick={() => router.push("/users/chat")}
            className={pathname.startsWith("/users/chat") ? "bg-secondary text-white !hover:bg-secondary !hover:text-white" : ""}
          />
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => router.push("/users/friends")}
            className={pathname.startsWith("/users/friends") ? "bg-secondary text-white !hover:bg-secondary !hover:text-white" : ""}
          />
          <Button
            type="text"
            icon={<TeamOutlined />}
            onClick={() => router.push("/users/groups")}
            className={pathname.startsWith("/users/groups") ? "bg-secondary text-white !hover:bg-secondary !hover:text-white" : ""}
          />
        </div>
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

export default UsersLayout;
