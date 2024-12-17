"use client";

import React from "react";
import { Drawer, List, Avatar } from "antd";
import Link from "next/link";
import { useDrawer } from "@/app/context/DrawerContext";
import { groups } from "../mockData";

const GroupsLayout = ({ children }: { children: React.ReactNode }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();

  const renderGroupList = () => (
    <List
      itemLayout="horizontal"
      dataSource={groups}
      renderItem={group => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar>{group.avatar}</Avatar>}
            title={<Link href={`/users/groups/${group.id}`}>{group.name}</Link>}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 hidden md:block">
        {renderGroupList()}
      </div>
      {/* Drawer for mobile */}
      <Drawer
        title="Groups"
        placement="left"
        closable={false}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        className="md:hidden"
      >
        {renderGroupList()}
      </Drawer>
      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default GroupsLayout;
