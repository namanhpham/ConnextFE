'use client';

import React, { useState } from "react";
import { ReactNode } from "react";
import { Layout, Menu, Drawer, Button, Avatar, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const UsersLayout = ({ children }: { children: ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">Profile Settings</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="h-screen text-black ">
      {/* Sidebar for larger screens */}
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        className="bg-accent hidden md:block"
        width={250}
      >
        <div className="text-text text-xl font-bold p-4">Chats</div>
        <Menu
            theme="dark"
            mode="inline"
            className="bg-primary text-text"
          items={[
            { key: "1", label: <span className="text-text">John Doe</span> },
            { key: "2", label: <span className="text-text">Jane Smith</span> },
          ]}
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
          className="bg-white text-text"
          items={[
            { key: "1", label: "John Doe" },
            { key: "2", label: "Jane Smith" },
          ]}
        />
      </Drawer>
      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-primary text-white flex items-center justify-between p-4">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="text-white md:hidden"
            onClick={() => setIsDrawerOpen(true)}
          />
          <h1 className="text-xl font-bold">Connext</h1>
          <Dropdown overlay={userMenu} trigger={['click']}>
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
