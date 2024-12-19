"use client";

import React, { useEffect, useState, createContext } from "react";
import { Layout, Avatar, Drawer, Spin } from "antd";
import { useDrawer } from "@/app/context/DrawerContext";
import { conversationApiService, authApiService } from "@/app/api/apiService";
import { SocketContext } from "@/app/context/SocketContext"; // Import SocketContext
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter, usePathname } from "next/navigation"; // Import necessary hooks
dayjs.extend(relativeTime);

export const RecipientContext = createContext<number | null>(null);

const { Sider, Content } = Layout;

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [recipientId, setRecipientId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { socket, onMessage } = React.useContext(SocketContext); // Get socket and onMessage from SocketContext
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUserId(Number(userId));
    }
    // Initial fetch
    fetchConversations(1);
  }, []);

  useEffect(() => {
    // Extract selected conversation ID from the URL
    const pathSegments = pathname.split("/");
    const convId = pathSegments[pathSegments.length - 1];
    if (convId) {
      setSelectedConversationId(Number(convId));
      // Mark the conversation as read
      setConversations((prevConversations) =>
        prevConversations.map((conversation) =>
          conversation.conversation_id === Number(convId)
            ? { ...conversation, unread: false }
            : conversation
        )
      );
    }
  }, [pathname]);

  const fetchConversations = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await conversationApiService.getConversations(10, pageNumber);
      if (data.conversations) {
        setConversations((prevConversations) => {
          // Create a map of existing conversations to preserve unread statuses
          const conversationMap = new Map(
            prevConversations.map((conv) => [conv.conversation_id, conv])
          );

          // Merge fetched conversations with existing ones
          const updatedConversations = data.conversations.map((conv: any) => {
            const existingConv = conversationMap.get(conv.conversation_id);
            return existingConv
              ? { ...conv, unread: existingConv.unread }
              : { ...conv, unread: false }; // Initialize unread to false for new conversations
          });

          // Return the updated conversations list
          return updatedConversations;
        });
      }
      setHasMore(data.pagination.hasMore);
      setPage(pageNumber + 1);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
      fetchConversations(page);
    }
  };

  const formatLastMessageTime = (timestamp: string | null) => {
    if (!timestamp) return "";
    const messageDate = dayjs(timestamp).add(7, 'hour');
    const now = dayjs();
    if (messageDate.isSame(now, "day")) {
      return "Today";
    } else {
      return messageDate.fromNow(true); // e.g., '1 day', '2 days'
    }
  };

  const handleConversationClick = (conversationId: number, recipientId: number, recipientName: string) => {
    setRecipientId(recipientId);
    localStorage.setItem("recipientId", recipientId.toString());
    localStorage.setItem("recipientName", recipientName);
    setSelectedConversationId(conversationId);
    // Mark the conversation as read
    setConversations((prevConversations) =>
      prevConversations.map((conversation) =>
        conversation.conversation_id === conversationId
          ? { ...conversation, unread: false }
          : conversation
      )
    );
    router.push(`/users/chat/${conversationId}`);
  };

  const renderConversationItems = conversations.map((conversation) => {
    const participant =
      conversation.first_participant_id.userId === currentUserId
        ? conversation.second_participant_id
        : conversation.first_participant_id;

    const recipientId = participant.userId;

    const lastMessage =
      conversation.last_message && conversation.last_message.length > 20
        ? conversation.last_message.substring(0, 20) + "..."
        : conversation.last_message || "No messages yet";

    const lastMessageTime = formatLastMessageTime(conversation.last_message_sent_at);

    return (
      <div
        key={conversation.conversation_id}
        onClick={() => handleConversationClick(conversation.conversation_id, recipientId, participant.username)}
        className={`flex items-center space-x-2 p-2 cursor-pointer ${
          conversation.conversation_id === selectedConversationId ? "bg-gray-300" : "hover:bg-gray-200"
        }`}
      >
        <Avatar src={participant.avatarUrl || undefined}>
          {!participant.avatarUrl && participant.username.charAt(0)}
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span
              className={`text-gray-800 truncate ${
                conversation.unread ? "font-bold" : "font-semibold"
              }`}
            >
              {participant.username}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm truncate ${
                conversation.unread ? "font-bold text-gray-800" : "text-gray-600"
              }`}
            >
              {lastMessage}
            </span>
            <span className="text-gray-500 text-xs">
              {lastMessageTime}
            </span>
          </div>
        </div>
      </div>
    );
  });

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on("onMessage", (message: any) => {
      const incomingMessage = message.message;
      console.log("Received message in layout:", incomingMessage);

      // Ensure the necessary properties exist before accessing them
      if (incomingMessage && incomingMessage.conversation_id && incomingMessage.conversation_id.conversation_id) {
        const incomingConvId = incomingMessage.conversation_id.conversation_id;

        // Update conversations list
        setConversations((prevConversations) => {
          const updatedConversations = prevConversations.map((conversation) => {
            if (conversation.conversation_id === incomingConvId) {
              return {
                ...conversation,
                last_message: incomingMessage.content || "You received a new attachment",
                last_message_sent_at: incomingMessage.timestamp,
                // Set unread to true if it's not the selected conversation
                unread: incomingConvId !== selectedConversationId ? true : false,
              };
            }
            return conversation;
          });

          return updatedConversations;
        });
      }
    });

    // Cleanup the listener on unmount or when socket changes
    return () => {
      if (socket) {
        socket.off("onMessage");
      }
    };
  }, [socket, selectedConversationId]); // Include selectedConversationId in dependencies

  return (
    <RecipientContext.Provider value={recipientId}>
      <Layout className="h-screen text-black">
        {/* Sidebar for larger screens */}
        <Sider
          breakpoint="md"
          collapsedWidth="0"
          className="bg-accent hidden md:block"
          width={250}
        >
          <div className="text-xl font-bold p-4">Chats</div>
          <div
            className="overflow-y-auto"
            onScroll={handleScroll}
            style={{ height: 'calc(100vh - 64px)' }} // Adjust height as needed
          >
            {renderConversationItems}
            {loading && (
              <div className="flex justify-center p-2">
                <Spin />
              </div>
            )}
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
          <div
            className="overflow-y-auto"
            onScroll={handleScroll}
            style={{ height: '100%' }}
          >
            {renderConversationItems}
            {loading && (
              <div className="flex justify-center p-2">
                <Spin />
              </div>
            )}
          </div>
        </Drawer>

        {/* Main Layout */}
        <Layout>
          {/* Main Content */}
          <Content className="overflow-y-auto">{children}</Content>
        </Layout>
      </Layout>
    </RecipientContext.Provider>
  );
};

export default ChatLayout;
