"use client";

import React, { useState } from "react";
import { Layout, List, Avatar, Button, Input, Pagination, message, Modal } from "antd";
import { UserOutlined, MessageOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { users } from "../mockData";

const { Content } = Layout;

const FriendsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFriendSearchTerm, setNewFriendSearchTerm] = useState("");
  const pageSize = 10;
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSendMessage = (userId: string) => {
    router.push(`/users/chat/${userId}`);
  };

  const handleUnfriend = (userId: string) => {
    // Implement unfriend functionality
    message.success(`Unfriended user ${userId}`);
  };

  const handleAddFriend = (userId: string) => {
    // Implement add friend functionality
    message.success(`Friend request sent to user ${userId}`);
  };

  const filteredFriends = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFriends = filteredFriends.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const filteredNewFriends = users.filter((user) =>
    user.name.toLowerCase().includes(newFriendSearchTerm.toLowerCase())
  );

  return (
    <div className="h-screen text-black">
      <Content className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search friends..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Add New Friend
          </Button>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={paginatedFriends}
          renderItem={(user) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<MessageOutlined />}
                  onClick={() => handleSendMessage(user.id)}
                >
                  Message
                </Button>,
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  onClick={() => handleUnfriend(user.id)}
                >
                  Unfriend
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={user.name}
                description={user.avatar}
              />
            </List.Item>
          )}
        />
        <div className="flex justify-center mt-4">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredFriends.length}
            onChange={handlePageChange}
          />
        </div>
      </Content>

      <Modal
        title="Add New Friend"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Input
          placeholder="Search for new friends..."
          prefix={<SearchOutlined />}
          value={newFriendSearchTerm}
          onChange={(e) => setNewFriendSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <List
          itemLayout="horizontal"
          dataSource={filteredNewFriends}
          renderItem={(user) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<UserAddOutlined />}
                  onClick={() => handleAddFriend(user.id)}
                >
                  Add Friend
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={user.name}
                description={user.avatar}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default FriendsPage;
