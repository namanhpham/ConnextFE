"use client";

import React from "react";
import { messages, users } from "../mockData";
import { Input, Button, Row, Col, Avatar } from "antd";
import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import { useDrawer } from "@/app/context/DrawerContext";

const UserPage = ({ params }: { params: { id: string }; }) => {
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();
  const { id } = params;

  const user = users.find((user) => user.id === id);
  const chatMessages = messages[id] || []; // No more TypeScript error here

  if (!user) {
    return <div className="p-8 text-center text-gray-500">User not found.</div>;
  }

  const getUser = (sender: string) => {
    return sender === "current" ? { name: "You", avatar: "Y" } : user;
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
                      {message.text}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="bg-primary p-4 flex items-center space-x-2">
        <Input
          placeholder="Type a message..."
          className="flex-1"
          size="large"
        />
        <Button type="primary" size="large">
          Send 
        </Button>
      </div>
    </div>
  );
};

export default UserPage;
