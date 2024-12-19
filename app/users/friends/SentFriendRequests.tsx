"use client";
import React, { useState, useEffect } from "react";
import { List, Avatar, Button, message } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";
import { friendsApiService } from "@/app/api/apiService";

interface SentFriendRequestsProps {
  currentUserId: string;
  sentFriendRequests: any[];
}

const SentFriendRequests: React.FC<SentFriendRequestsProps> = ({ currentUserId, sentFriendRequests }) => {
  

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
            //   onClick={() => handleCancelFriendRequest(request.userId)}
            // >
            //   Cancel
            // </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={request.username}
            description={request.email}
          />
        </List.Item>
      )}
    />
  );
};

export default SentFriendRequests;
