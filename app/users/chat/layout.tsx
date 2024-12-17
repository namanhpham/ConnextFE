"use client";

import React, { useEffect, useState } from "react";
import { Layout, Avatar, Drawer } from "antd";
import Link from "next/link";
import { useDrawer } from "@/app/context/DrawerContext";
import { conversationApiService } from "@/app/api/apiService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const { Sider, Content } = Layout;

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {

    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUserId(Number(userId));
    }

    const fetchConversations = async () => {
      try {
        const data = await conversationApiService.getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  const formatLastMessageTime = (timestamp: string | null) => {
    if (!timestamp) return "";
    const messageDate = dayjs(timestamp);
    const now = dayjs();
    if (messageDate.isSame(now, "day")) {
      return "Today";
    } else {
      return messageDate.fromNow(true); // e.g., '1 day', '2 days'
    }
  };

  const renderConversationItems = conversations.map((conversation) => {
    const participant =
      conversation.first_participant_id.userId === currentUserId
        ? conversation.second_participant_id
        : conversation.first_participant_id;

    const lastMessage =
      conversation.last_message && conversation.last_message.length > 20
        ? conversation.last_message.substring(0, 20) + "..."
        : conversation.last_message || "No messages yet";

    const lastMessageTime = formatLastMessageTime(conversation.last_message_sent_at);

    return (
      <Link key={conversation.conversation_id} href={`/users/chat/${conversation.conversation_id}`}>
        <div className="flex items-center space-x-2 p-2 hover:bg-gray-200">
          <Avatar>{participant.username.charAt(0)}</Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-semibold truncate">
                {participant.username}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm truncate">
                {lastMessage}
              </span>
              <span className="text-gray-500 text-xs">
                {lastMessageTime}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <Layout className="h-screen text-black">
      {/* Sidebar for larger screens */}
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        className="bg-accent hidden md:block"
        width={250}
      >
        <div className="text-xl font-bold p-4">Chats</div>
        <div className="overflow-y-auto">
          {renderConversationItems}
        </div>
      </Sider>

      {/* Drawer for smaller screens */}
      <Drawer
        title="Chats"
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        className="md:hidden"
      >
        <div>
          {renderConversationItems}
        </div>
      </Drawer>

      {/* Main Layout */}
      <Layout>
        {/* Main Content */}
        <Content className="overflow-y-auto">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default ChatLayout;
