"use client";

import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from "react";
import { Input, Button, Row, Col, Avatar, Upload, Spin, message as modalMessage } from "antd";
import { MenuOutlined, SettingOutlined, PictureOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useDrawer } from "@/app/context/DrawerContext";
import { SocketContext } from "@/app/context/SocketContext";
import { conversationApiService } from "@/app/api/apiService"; // Import API service
import { sendMessage } from "@/app/api/conversations/conversationApiService"; // Import sendMessage API
import { RecipientContext } from "../layout"; // Import RecipientContext
import { uploadToS3 } from "@/app/api/utils/uploadImg"; // Import uploadToS3

const { TextArea } = Input;

const UserPage = ({ params }: { params: { id: string }; }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const { id } = params;

  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string | null>(null);
  const [videoPreviews, setVideoPreviews] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null); // Store media file
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false); // Track sending state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesStartRef = useRef<HTMLDivElement>(null);
  const { socket } = React.useContext(SocketContext); // Get socket and onMessage from SocketContext
  const [recipientName, setRecipientName] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  const fetchMessages = async (pageNumber: number) => {
    setLoading(true);
    try {
      const reqBody = {
        conversationId: Number(id),
        limit: 30,
        offset: pageNumber, // offset is current page number
      };
      const data = await conversationApiService.getMessages(reqBody);
      setChatMessages((prev) => [...data.messages, ...prev]);
      setHasMore(data.hasMore);
      setPage(pageNumber + 1);
      console.log("Fetched messages:", data);
      console.log("hasMore:", hasMore);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1);
    // console.log("Recipient ID chat: ", recipientId);
    const recipientName = localStorage.getItem("recipientName");
    setRecipientName(recipientName);
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUserId(Number(userId));
    }

    if (!socket) return;

    // Listen for incoming messages
    socket.on("onMessage", (message: any) => {
      const incomingMessage = message.message;
      console.log("Received message in chat page:", incomingMessage);
      // console.log("message content: ", incomingMessage.content);
      // console.log("message conversation_id: ", incomingMessage.conversation_id.conversation_id);
      // Ensure the necessary properties exist before accessing them
      if (incomingMessage && incomingMessage.conversation_id && incomingMessage.conversation_id.conversation_id) {
        if (incomingMessage.conversation_id.conversation_id === Number(id)) {
          setChatMessages((prev) => [...prev, incomingMessage]);
        }
      }
    });

    return () => {
      if (socket) {
        socket.off("onMessage");
      }
    };
  }, [id, socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMore && !loading) {
      previousScrollHeightRef.current = messagesContainerRef.current?.scrollHeight || 0;
      await fetchMessages(page);
    }
  };

  useLayoutEffect(() => {
    if (messagesContainerRef.current && previousScrollHeightRef.current) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight;
      messagesContainerRef.current.scrollTop = newScrollHeight - previousScrollHeightRef.current;
    }
  }, [chatMessages]);

  const getUserInfo = (message: any) => {
    const isCurrentUser = message.sender_id.userId === currentUserId;
    return {
      isCurrentUser,
      name: isCurrentUser ? "" : message.sender_id.username,
      avatar: isCurrentUser ? "" : message.sender_id.avatarUrl,
    };
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" && !imagePreviews && !videoPreviews) return;

    setSending(true); // Set sending state to true

    let mediaUrl = "";
    let mediaType = "text";

    if (mediaFile) {
      try {
        const s3Response = await uploadToS3(mediaFile);
        mediaUrl = s3Response.fileUrl;
        mediaType = s3Response.fileType.startsWith("image") ? "image" : "video";
      } catch (error) {
        console.error("Failed to upload media:", error);
        modalMessage.error("Failed to upload media");
        setSending(false); // Reset sending state
        return;
      }
    }

    const newChatMessage = {
      senderId: currentUserId,
      recipientId: Number(localStorage.getItem("recipientId")),
      conversationId: Number(id),
      content: newMessage,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
    };

    try {
      const sentMessage = await sendMessage(newChatMessage);
      // console.log("Message sent:", sentMessage);

      // Optimistically update the UI
      // dont need setChatMessages because we already fetch it from websocket
      // setChatMessages([...chatMessages, sentMessage]);
      setNewMessage("");
      setImagePreviews(null);
      setVideoPreviews(null);
      setMediaFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false); // Reset sending state
    }
  };

  const handleUpload = (file: any) => {
    if (file.size > 25 * 1024 * 1024) {
      alert("File size should be less than 25MB");
      return false;
    }

    setMediaFile(file);

    if (file.type.startsWith("image/")) {
      setImagePreviews(URL.createObjectURL(file));
      setVideoPreviews(null);
    } else if (file.type.startsWith("video/")) {
      setVideoPreviews(URL.createObjectURL(file));
      setImagePreviews(null);
    }

    return false;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRemoveImage = () => {
    setImagePreviews(null);
    setMediaFile(null);
  };

  const handleRemoveVideo = () => {
    setVideoPreviews(null);
    setMediaFile(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-primary border-b p-4 shadow-md flex justify-between items-center">
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: "#19b3a8" }} />}
          className="text-white md:hidden"
          onClick={() => {
            setIsDrawerOpen(true);
            console.log('Open drawer');
            console.log("current drawer state: ", isDrawerOpen);
          }}
        />
        <h2 className="text-lg font-bold text-textGray">{recipientName}</h2>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-primary space-y-4"
        onScroll={handleScroll}
        ref={messagesContainerRef}
      >
        <div ref={messagesStartRef} />
        {[...chatMessages].map((message, index) => { // Create a copy before reversing
          const { isCurrentUser, name, avatar } = getUserInfo(message);

          return (
            <Row
              key={message.message_id}
              justify={isCurrentUser ? "end" : "start"}
            >
              <Col>
                <div className={`flex items-start space-x-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                  {!isCurrentUser && <Avatar src={avatar} />}
                  <div>
                    {!isCurrentUser && <div className="text-xs text-gray-500 pb-1">{name}</div>}
                    <div
                      className={`font-semibold ${
                        isCurrentUser
                          ? "bg-secondary text-light"
                          : "bg-accent text-textGray"
                      } p-3 rounded-lg max-w-xs break-words`} // Ensure long messages break into new lines
                    >
                      {message.content && <p>{message.content}</p>}
                      {message.media_url && message.media_type == "image" && (
                        <Image key={index} src={message.media_url as string} alt="Sent image" width={150} height={150} className="rounded-lg" />
                      )}
                      {message.media_url && message.media_type == "video" && (
                        <video controls key={index} className="rounded-lg">
                          <source src={message.media_url as string} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          );
        })}
        <div ref={messagesEndRef} />
        {loading && (
          <div className="flex justify-center p-2">
            <Spin />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-primary p-4 flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <TextArea
            placeholder="Type a message..."
            className="flex-1"
            size="large"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            autoSize={{ minRows: 1, maxRows: 6 }} // Expandable textarea
          />
          <Upload
            showUploadList={false}
            beforeUpload={handleUpload}
          >
            <Button type="text" icon={<PictureOutlined />} size="large" />
          </Upload>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleSendMessage} 
            disabled={sending} // Disable button while sending
            loading={sending} // Show loading spinner while sending
          >
            Send 
          </Button>
        </div>
        {imagePreviews && (
          <div className="relative flex space-x-2">
            <div className="relative">
              <Image src={imagePreviews} alt="Preview" width={150} height={150} className="rounded-lg" />
              <Button
                type="text"
                icon={<CloseOutlined />}
                className="absolute top-0 right-0"
                onClick={handleRemoveImage}
              />
            </div>
          </div>
        )}
        {videoPreviews && (
          <div className="relative flex space-x-2">
            <div className="relative">
              <video controls width="150" className="rounded-lg">
                <source src={videoPreviews} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button
                type="text"
                icon={<CloseOutlined />}
                className="absolute top-0 right-0"
                onClick={handleRemoveVideo}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default UserPage;
