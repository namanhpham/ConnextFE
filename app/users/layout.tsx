'use client';

import React, { useState } from "react";
import { ReactNode } from "react";
import { Layout, Menu, Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const UsersLayout = ({ children }: { children: ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Layout className="h-screen text-black">
      {/* Sidebar for larger screens */}
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        className="bg-primary hidden md:block"
        width={250}
      >
        <div className="text-text text-xl font-bold p-4">Chats</div>
        <Menu
          theme="dark"
          mode="inline"
          className="bg-primary"
          items={[
            { key: "1", label: "John Doe" },
            { key: "2", label: "Jane Smith" },
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
          theme="dark"
          mode="inline"
          items={[
            { key: "1", label: "John Doe" },
            { key: "2", label: "Jane Smith" },
          ]}
        />
      </Drawer>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-secondary text-white flex items-center justify-between p-4">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="text-white md:hidden"
            onClick={() => setIsDrawerOpen(true)}
          />
          <h1 className="text-xl font-bold">Connext</h1>
        </Header>

        {/* Main Content */}
        <Content className="overflow-y-auto">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default UsersLayout;
