"use client";
import React, { useState, useEffect } from "react";
import { List, Avatar, Button, Input, Pagination, message } from "antd";
import { UserOutlined, SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { friendsApiService, userApiService } from "@/app/api/apiService";

interface AddFriendsProps {
  currentUserId: string;
  refreshFriendsList: () => void;
}

const AddFriends: React.FC<AddFriendsProps> = ({ currentUserId, refreshFriendsList }) => {
  const [newFriendSearchTerm, setNewFriendSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchAllUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, newFriendSearchTerm, currentUserId]);

  const fetchAllUsers = async () => {
    const result = await userApiService.getAllUsers(currentPage, pageSize);
    result.data = result.data.filter((user: any) => user.isFriend === false);
    console.log("currentUserId", currentUserId);
    setAllUsers(result.data);
    setTotalUsers(result.pagination.totalResult);
  };

  const handleNewFriendSearch = async () => {
    const result = await userApiService.searchUser(newFriendSearchTerm, currentPage, pageSize);
    result.data = result.data.filter((user: any) => user.isFriend === false);
    setAllUsers(result.data);
    setTotalUsers(result.pagination.totalResult);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddFriend = async (userId: string) => {
    try {
      await friendsApiService.createFriendRequest(userId);
      message.success(`Friend request sent to user ${userId}`);
      refreshFriendsList();
    } catch (error) {
      message.error("Failed to send friend request");
    }
  };

  const handleNewFriendSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFriendSearchTerm(e.target.value);
  };

  return (
    <>
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
            key={user.userId}
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
              avatar={user.avatarUrl == null ? (<Avatar icon={<UserOutlined />} />) : (<Avatar src={user.avatarUrl} />)}
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
    </>
  );
};

export default AddFriends;
