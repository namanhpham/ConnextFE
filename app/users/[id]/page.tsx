"use client";

import React from "react";
import { messages, users } from "../mockData";
import { Input, Button, Row, Col } from "antd";

const UserPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const user = users.find((user) => user.id === id);
  const chatMessages = messages[id] || []; // No more TypeScript error here

  if (!user) {
    return <div className="p-8 text-center text-gray-500">User not found.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-accent text-light p-4 shadow-md flex justify-between items-center">
        <h2 className="text-lg font-bold text-text">{user.name}</h2>
        <div className="flex space-x-4">
          <Button type="text" className="text-light hover:text-highlight">
            Search
          </Button>
          <Button type="text" className="text-light hover:text-highlight">
            Options
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-primary space-y-4">
        {chatMessages.map((message) => (
          <Row
            key={message.id}
            justify={message.sender === "current" ? "end" : "start"}
          >
            <Col>
              <div
                className={`font-semibold ${
                  message.sender === "current"
                    ? "bg-secondary text-light"
                    : "bg-accent text-textGray"
                } p-3 rounded-lg max-w-xs`}
              >
                {message.text}
              </div>
            </Col>
          </Row>
        ))}
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
