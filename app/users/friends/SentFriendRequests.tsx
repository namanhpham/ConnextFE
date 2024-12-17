"use client";
import React, { useState, useEffect } from "react";
import { List, Avatar, Button, message } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { friendsApiService } from "@/app/api/apiService";

interface SentFriendRequestsProps {
  currentUserId: string;
}

const SentFriendRequests: React.FC<SentFriendRequestsProps> = ({ currentUserId }) => {
  const [sentFriendRequests, setSentFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    if (currentUserId) {
      fetchSentFriendRequests();
    }
  }, [currentUserId]);

  const fetchSentFriendRequests = async () => {
    const result = await friendsApiService.getSentFriendRequests();
    const sentFriendRequestsList = result.map((friend: any) => {
      if (friend.user_id.userId === Number(currentUserId)) {
        return friend.friend_user_id;
      } else {
        return friend.user_id;
      }
    });
    setSentFriendRequests(sentFriendRequestsList);
  };

  const handleCancelFriendRequest = async (friendRequestId: number) => {
    try {
      await friendsApiService.rejectFriendRequest(friendRequestId);
      message.success(`Cancelled friend request ${friendRequestId}`);
      fetchSentFriendRequests();
    } catch (error) {
      message.error("Failed to cancel friend request");
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={sentFriendRequests}
      renderItem={(request) => (
        <List.Item
          key={request.friendship_id}
          actions={[
            // <Button
            //   key="cancel"
            //   type="link"
            //   icon={<DeleteOutlined />}
            //   onClick={() => handleCancelFriendRequest(request.friendship_id)}
            // >
            //   Cancel
            // </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={request.friend_user_id.username}
            description={request.friend_user_id.email}
          />
        </List.Item>
      )}
    />
  );
};

export default SentFriendRequests;
