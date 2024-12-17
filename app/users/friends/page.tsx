"use client";

import React, { useState, useEffect } from "react";
import {
  Layout,
  List,
  Avatar,
  Button,
  Input,
  Pagination,
  message,
  Tabs,
  Modal,
} from "antd";
import {
  UserOutlined,
  MessageOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
// import { getAllUsers } from "../../api/users/userApiService";
import { userApiService } from "@/app/api/apiService";
import { users } from "../mockData";

const { Content } = Layout;
const { TabPane } = Tabs;

const FriendsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newFriendSearchTerm, setNewFriendSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  interface User {
    userId: string;
    username: string;
    email: string;
  }
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 3;
  const router = useRouter();

  useEffect(() => {
    if (activeTab === "addFriends") {
      fetchAllUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, newFriendSearchTerm, activeTab]);

  const fetchAllUsers = async () => {
    const result = await userApiService.getAllUsers(currentPage, pageSize);
    setAllUsers(result.data);
    setTotalUsers(result.pagination.totalResult);
  };

  const handleSearch = async () => {
    const result = await userApiService.searchUser(searchTerm, currentPage, pageSize);
    setAllUsers(result.data);
    setTotalUsers(result.pagination.totalResult);
  };

  const handleNewFriendSearch = async () => {
    const result = await userApiService.searchUser(newFriendSearchTerm, currentPage, pageSize);
    setAllUsers(result.data);
    setTotalUsers(result.pagination.totalResult);
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

  const handleNewFriendSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFriendSearchTerm(e.target.value);
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

  const incomingFriendRequests = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Replace with actual logic to filter incoming friend requests
  );

  return (
    <div className="h-screen text-black">
      <Content className="p-4">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Friends" key="friends">
            <div className="flex gap-x-4 items-center mb-4">
              <Input
                placeholder="Search friends..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
              />
              <Button 
                type="primary"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={paginatedFriends}
              renderItem={(user) => (
                <List.Item
                  key={user.id}  // Add key prop here
                  actions={[
                    <Button
                      key="message"
                      type="link"
                      icon={<MessageOutlined />}
                      onClick={() => handleSendMessage(user.id)}
                    >
                      Message
                    </Button>,
                    <Button
                      key="unfriend"
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
          </TabPane>
          <TabPane tab="Incoming Friend Requests" key="requests">
            <List
              itemLayout="horizontal"
              dataSource={incomingFriendRequests}
              renderItem={(user) => (
                <List.Item
                  key={user.id}  // Add key prop here
                  actions={[
                    <Button
                      key="accept"
                      type="link"
                      icon={<UserAddOutlined />}
                      onClick={() => handleAddFriend(user.id)}
                    >
                      Accept
                    </Button>,
                    <Button
                      key="decline"
                      type="link"
                      icon={<DeleteOutlined />}
                      onClick={() => handleUnfriend(user.id)}
                    >
                      Decline
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
          </TabPane>
          <TabPane tab="Add Friends" key="addFriends">
            <div className="flex gap-x-4 items-center mb-4">
              <Input
                placeholder="Search for new friends..."
                prefix={<SearchOutlined />}
                value={newFriendSearchTerm}
                onChange={handleNewFriendSearchTermChange}
                style={{ width: 300 }}
              />
              <Button 
                type="primary"
                onClick={handleNewFriendSearch}
              >
                Search
              </Button>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={allUsers}
              renderItem={(user) => (
                <List.Item
                  key={user.userId}  // Add key prop here
                  actions={[
                    <Button
                      key="addFriend"
                      type="link"
                      icon={<UserAddOutlined />}
                      onClick={() => handleAddFriend(user.userId)}
                    >
                      Add Friend
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={user.username}
                    description={user.email}
                  />
                </List.Item>
              )}
            />
            <div className="flex justify-center mt-4">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalUsers}
                onChange={handlePageChange}
              />
            </div>
          </TabPane>
        </Tabs>
      </Content>
    </div>
  );
};

export default FriendsPage;
