"use client";

import React, { useEffect, useState } from "react";
import { Drawer, List, Avatar, Spin, Button, Modal, Select, message } from "antd";
import Link from "next/link";
import { useDrawer } from "@/app/context/DrawerContext";
import { groupChatApiService, friendsApiService } from "@/app/api/apiService"; // Import API services

const { Option } = Select;

const GroupsLayout = ({ children }: { children: React.ReactNode }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const data = await groupChatApiService.getUserGroupChats();
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFriends = async () => {
      try {
        const currentUserId = localStorage.getItem("userId");
        const result = await friendsApiService.getAllFriends();
        const friendList = result.map((friend: any) => {
          if (friend.user_id.userId === Number(currentUserId)) {
            return friend.friend_user_id;
          } else {
            return friend.user_id;
          }
        });
        setFriends(friendList);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchGroups();
    fetchFriends();
  }, []);

  const handleCreateGroup = async () => {
    if (selectedFriends.length === 0) {
      message.warning("Please select at least one friend to create a group.");
      return;
    }

    try {
      const data = await groupChatApiService.createNewGroupChat({ members: selectedFriends });
      setGroups((prevGroups) => [...prevGroups, data]);
      message.success("Group created successfully!");
      setIsModalVisible(false);
      setSelectedFriends([]);
    } catch (error) {
      console.error("Failed to create group:", error);
      message.error("Failed to create group.");
    }
  };

  const renderGroupList = () => (
    <List
      itemLayout="horizontal"
      dataSource={groups}
      renderItem={(group) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              group.created_by && group.created_by.avatarUrl ? (
                <Avatar src={group.created_by.avatarUrl} />
              ) : (
                <Avatar>{group.created_by && group.created_by.username ? group.created_by.username.charAt(0) : "?"}</Avatar>
              )
            }
            title={
              <Link
               onClick={() => {localStorage.setItem("groupId", group.group_id)}}
               href={`/users/groups/${group.group_id}`}>
                {group.group_name || "Unnamed Group"}
              </Link>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 hidden md:block">
        <Button type="primary" onClick={() => setIsModalVisible(true)} className="mb-4">
          Create New Group
        </Button>
        {loading ? <Spin /> : renderGroupList()}
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
        <Button type="primary" onClick={() => setIsModalVisible(true)} className="mb-4">
          Create New Group
        </Button>
        {loading ? <Spin /> : renderGroupList()}
      </Drawer>
      {/* Main content */}
      <div className="flex-1">{children}</div>

      {/* Create Group Modal */}
      <Modal
        title="Create New Group"
        visible={isModalVisible}
        onOk={handleCreateGroup}
        onCancel={() => setIsModalVisible(false)}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select friends to add to the group"
          value={selectedFriends}
          onChange={setSelectedFriends}
        >
          {friends.map((friend) => (
            <Option key={friend.userId} value={friend.userId}>
              {friend.username}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default GroupsLayout;
