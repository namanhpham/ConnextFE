"use client";
import React, { useState, useEffect } from "react";
import { List, Avatar, Button, message } from "antd";
import { UserOutlined, UserAddOutlined, DeleteOutlined } from "@ant-design/icons";
import { friendsApiService } from "@/app/api/apiService";

interface IncomingFriendRequestsProps {
  currentUserId: string;
  refreshFriendsList: () => void;
  receivedFriendRequests: any[];
  fetchReceivedFriendRequests: () => void;
  setReceivedFriendRequests: React.Dispatch<React.SetStateAction<any[]>>;
}

const IncomingFriendRequests: React.FC<IncomingFriendRequestsProps> = ({
  currentUserId,
  refreshFriendsList,
  receivedFriendRequests,
  fetchReceivedFriendRequests,
  setReceivedFriendRequests,
}) => {

  useEffect(() => {
    console.log("receivedFriendRequests", receivedFriendRequests);
  }, [currentUserId]);

  const handleAcceptFriendRequest = async (friendRequestId: number) => {
    try {
      await friendsApiService.acceptFriendRequest(friendRequestId);
      message.success(`Accepted friend request ${friendRequestId}`);
      fetchReceivedFriendRequests();
      refreshFriendsList();
      setReceivedFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.friendship_id !== friendRequestId)
      );
    } catch (error) {
      message.error("Failed to accept friend request");
    }
  };

  const handleRejectFriendRequest = async (friendRequestId: number) => {
    try {
      await friendsApiService.rejectFriendRequest(friendRequestId);
      message.success(`Rejected friend request ${friendRequestId}`);
      fetchReceivedFriendRequests();
      setReceivedFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.friendship_id !== friendRequestId)
      );
    } catch (error) {
      message.error("Failed to reject friend request");
    }
  };

  return (
    <List
      itemLayout="horizontal"
      dataSource={receivedFriendRequests}
      renderItem={(request) => (
        <List.Item
          key={request.friendship_id}
          actions={[
            <Button
              key="accept"
              type="link"
              icon={<UserAddOutlined />}
              onClick={() => handleAcceptFriendRequest(request.friendship_id)}
            >
              Accept
            </Button>,
            <Button
              key="decline"
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleRejectFriendRequest(request.friendship_id)}
            >
              Decline
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
               title={request.username || "Unknown User"}
            description={request.email || "No email available"}
          />
        </List.Item>
      )}
    />
  );
};

export default IncomingFriendRequests;
