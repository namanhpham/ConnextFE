"use client";

import React, { useState, useRef, useEffect } from "react";
import { messages, users } from "../mockData";
import { Input, Button, Row, Col, Avatar, Upload } from "antd";
import { MenuOutlined, SettingOutlined, PictureOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useDrawer } from "@/app/context/DrawerContext";

const UserPage = ({ params }: { params: { id: string }; }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const { id } = params;

  const user = users.find((user) => user.id === id);
  const [chatMessages, setChatMessages] = useState(messages[id] || []);
  const [newMessage, setNewMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  if (!user) {
    return <div className="p-8 text-center text-gray-500">User not found.</div>;
  }

  const getUser = (sender: string) => {
    return sender === "current" ? { name: "You", avatar: "Y" } : user;
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && imagePreviews.length === 0 && videoPreviews.length === 0) return;

    const newChatMessage = {
      id: chatMessages.length + 1,
      text: newMessage,
      imageUrls: imagePreviews,
      videoUrls: videoPreviews,
      sender: "current",
    };

    setChatMessages([...chatMessages, newChatMessage]);
    setNewMessage("");
    setImagePreviews([]);
    setVideoPreviews([]);
  };

  const handleUpload = (file: any) => {
    if (file.size > 25 * 1024 * 1024) {
      alert("File size should be less than 25MB");
      return false;
    }

    if (file.type.startsWith("image/")) {
      setImagePreviews([...imagePreviews, URL.createObjectURL(file)]);
    } else if (file.type.startsWith("video/")) {
      setVideoPreviews([...videoPreviews, URL.createObjectURL(file)]);
    }

    return false;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideoPreviews(videoPreviews.filter((_, i) => i !== index));
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
        <h2 className="text-lg font-bold text-textGray">{user.name}</h2>
        <div className="flex space-x-4 items-center">
          <Input
            placeholder="Search..."
            size="small"
          />
          <Button
            type="text"
            icon={<SettingOutlined />}
            className="text-textGray hover:text-highlight"
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-primary space-y-4">
        {chatMessages.map((message) => {
          const messageUser = getUser(message.sender);
          return (
            <Row
              key={message.id}
              justify={message.sender === "current" ? "end" : "start"}
            >
              <Col>
                <div className={`flex items-start space-x-1 ${message.sender === "current" ? "flex-row-reverse" : ""}`}>
                  {message.sender !== "current" && <Avatar>{messageUser.avatar}</Avatar>}
                  <div>
                    {message.sender !== "current" && <div className="text-xs text-gray-500 pb-1">{messageUser.name}</div>}
                    <div
                      className={`font-semibold ${
                        message.sender === "current"
                          ? "bg-secondary text-light"
                          : "bg-accent text-textGray"
                      } p-3 rounded-lg max-w-xs`}
                    >
                      {message.text && <p>{message.text}</p>}
                      {message.imageUrls && message.imageUrls.map((url, index) => (
                        <Image key={index} src={url} alt="Sent image" width={150} height={150} className="rounded-lg" />
                      ))}
                      {message.videoUrls && message.videoUrls.map((url, index) => (
                        <video key={index} controls width="150" className="rounded-lg">
                          <source src={url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-primary p-4 flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type a message..."
            className="flex-1"
            size="large"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Upload
            showUploadList={false}
            beforeUpload={handleUpload}
          >
            <Button type="text" icon={<PictureOutlined />} size="large" />
          </Upload>
          <Button type="primary" size="large" onClick={handleSendMessage}>
            Send 
          </Button>
        </div>
        {imagePreviews.length > 0 && (
          <div className="relative flex space-x-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <Image src={preview} alt="Preview" width={150} height={150} className="rounded-lg" />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  className="absolute top-0 right-0"
                  onClick={() => handleRemoveImage(index)}
                />
              </div>
            ))}
          </div>
        )}
        {videoPreviews.length > 0 && (
          <div className="relative flex space-x-2">
            {videoPreviews.map((preview, index) => (
              <div key={index} className="relative">
                <video controls width="150" className="rounded-lg">
                  <source src={preview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  className="absolute top-0 right-0"
                  onClick={() => handleRemoveVideo(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
