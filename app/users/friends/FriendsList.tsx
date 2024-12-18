"use client";

import React, { useState, useEffect } from "react";
import { List, Avatar, Button, Input, Pagination, message } from "antd";
import { UserOutlined, MessageOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { friendsApiService } from "@/app/api/apiService";

interface FriendsListProps {
  currentUserId: string;
  friendsListRefreshKey: number;
}

const FriendsList: React.FC<FriendsListProps> = ({ currentUserId, friendsListRefreshKey }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [friends, setFriends] = useState<any[]>([]);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    if (currentUserId) {
      fetchFriends();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentUserId, friendsListRefreshKey]);

  const fetchFriends = async () => {
    const result = await friendsApiService.getAllFriends();
    const friendList = result.map((friend: any) => {
      if (friend.user_id.userId === Number(currentUserId)) {
        return friend.friend_user_id;
      } else {
        return friend.user_id;
      }
    });

    setFriends(friendList);
  };

  const handleSearch = () => {
    // Implement search logic if needed
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSendMessage = (userId: string) => {
    router.push(`/users/chat/${userId}`);
  };

  const handleUnfriend = (userId: string) => {
    message.success(`Unfriended user ${userId}`);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFriends = filteredFriends.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
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
        renderItem={(friend) => (
          <List.Item
            key={friend.friendship_id}
            actions={[
              <Button
                key="message"
                type="link"
                icon={<MessageOutlined />}
                onClick={() => handleSendMessage(friend.userId)}
              >
                Message
              </Button>,
              // <Button
              //   key="unfriend"
              //   type="link"
              //   icon={<DeleteOutlined />}
              //   onClick={() => handleUnfriend(friend.userId)}
              // >
              //   Unfriend
              // </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={friend.username}
              description={friend.email}
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
    </>
  );
};

export default FriendsList;
