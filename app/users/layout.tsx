// layout.tsx
"use client";

import React, { useState } from "react";
import { Layout, Menu, Drawer, Button, Avatar, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { users } from "./mockData";

const { Header, Sider, Content } = Layout;

const UsersLayout = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profile Settings</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
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
            label: <Link href={`/users/${user.id}`}><span className="text-textGray">{user.name}</span></Link>,
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
            label: <Link href={`/users/${user.id}`}><span className="text-textGray font-semibold">{user.name}</span></Link>,
          }))}
        />
      </Drawer>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-primary text-white flex items-center justify-between p-4 border-b border-accent">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="text-white md:hidden"
            onClick={() => setIsDrawerOpen(true)}
          />
          <h1 className="text-xl font-bold text-black">Connext</h1>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Avatar className="cursor-pointer" />
          </Dropdown>
        </Header>

        {/* Main Content */}
        <Content className="overflow-y-auto">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default UsersLayout;
