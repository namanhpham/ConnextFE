"use client";

import React, { useState, useEffect } from "react";
import { Layout, Tabs } from "antd";
import { useRouter } from "next/navigation";
import FriendsList from "./FriendsList";
import IncomingFriendRequests from "./IncomingFriendRequests";
import SentFriendRequests from "./SentFriendRequests";
import AddFriends from "./AddFriends";

const { Content } = Layout;
const { TabPane } = Tabs;

const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friendsListRefreshKey, setFriendsListRefreshKey] = useState(0);
  const router = useRouter();

  const refreshFriendsList = () => {
    setFriendsListRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
  }, []);

  return (
    <div className="h-screen text-black">
      <Content className="p-4">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Friends" key="friends">
            {currentUserId && (
              <FriendsList
                currentUserId={currentUserId}
                friendsListRefreshKey={friendsListRefreshKey}
              />
            )}
          </TabPane>
          <TabPane tab="Incoming Friend Requests" key="requests">
            {currentUserId && (
              <IncomingFriendRequests
                currentUserId={currentUserId}
                refreshFriendsList={refreshFriendsList}
              />
            )}
          </TabPane>
          <TabPane tab="Sent Friend Requests" key="sentRequests">
            {currentUserId && (
              <SentFriendRequests currentUserId={currentUserId} />
            )}
          </TabPane>
          <TabPane tab="Add Friends" key="addFriends">
            {currentUserId && <AddFriends currentUserId={currentUserId} />}
          </TabPane>
        </Tabs>
      </Content>
    </div>
  );
};

export default FriendsPage;
