"use client";

import React, { useState, useEffect } from "react";
import { Layout, Tabs } from "antd";
import { useRouter } from "next/navigation";
import FriendsList from "./FriendsList";
import IncomingFriendRequests from "./IncomingFriendRequests";
import SentFriendRequests from "./SentFriendRequests";
import AddFriends from "./AddFriends";
import { friendsApiService } from "@/app/api/apiService";

const { Content } = Layout;
const { TabPane } = Tabs;

const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friendsListRefreshKey, setFriendsListRefreshKey] = useState(0);
  const router = useRouter();

  // friend list refresh key to refresh the friends list
  const refreshFriendsList = () => {
    setFriendsListRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setCurrentUserId(userId);
  }, []);

  useEffect(() => {
    if (currentUserId) {
      if (activeTab === "friends") {
        fetchFriendsList();
      } else if (activeTab === "requests") {
        fetchReceivedFriendRequests();
      } else if (activeTab === "sentRequests") {
        fetchSentFriendRequests();
      } else if (activeTab === "addFriends") {
        // Fetch data for the "Add Friends" tab if necessary
      }
    }
  }, [activeTab, currentUserId, friendsListRefreshKey]);

  const fetchFriendsList = async () => {
    // Fetch the friends list
    // set state accordingly
  };

  // Sent friend requests
  const [sentFriendRequests, setSentFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    if (currentUserId) {
      fetchSentFriendRequests();
    }
  }, [currentUserId, friendsListRefreshKey]);

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

  // Incoming friend requests
  const [receivedFriendRequests, setReceivedFriendRequests] = useState<any[]>([]);

  useEffect(() => {
    if (currentUserId) {
      fetchReceivedFriendRequests();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, friendsListRefreshKey]);

  const fetchReceivedFriendRequests = async () => {
    const result = await friendsApiService.getReceivedFriendRequests();
    const incomingFriendList = result.map((friend: any) => {
      const friendShipId = friend.friendship_id;
      if (friend.user_id.userId === Number(currentUserId)) {
        friend.friend_user_id.friendship_id = friendShipId;
        return friend.friend_user_id;
      } else {
        friend.user_id.friendship_id = friendShipId;
        return friend.user_id;
      }
    });
    setReceivedFriendRequests(incomingFriendList);
  };

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
                receivedFriendRequests={receivedFriendRequests}
                fetchReceivedFriendRequests={fetchReceivedFriendRequests}
                setReceivedFriendRequests={setReceivedFriendRequests}
              />
            )}
          </TabPane>
          <TabPane tab="Sent Friend Requests" key="sentRequests">
            {currentUserId && (
              <SentFriendRequests 
                currentUserId={currentUserId}
                sentFriendRequests={sentFriendRequests}
              />
            )}
          </TabPane>
          <TabPane tab="Add Friends" key="addFriends">
            {currentUserId && <AddFriends 
              currentUserId={currentUserId} 
              refreshFriendsList={refreshFriendsList}
            />}
          </TabPane>
        </Tabs>
      </Content>
    </div>
  );
};

export default FriendsPage;
