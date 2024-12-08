import React from "react";
import { Input, Button, Row, Col } from "antd";

// Mock data for chat messages
const messages = [
  { id: 1, text: "Hi there! How are you?", sender: "other" },
  { id: 2, text: "I’m good! How about you?", sender: "current" },
  { id: 3, text: "Great to hear that! I'm doing well too.", sender: "other" },
  { id: 4, text: "Awesome! What’s new?", sender: "current" },
];

const UsersPage = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-primary text-light p-4 shadow-md flex justify-between items-center">
        <h2 className="text-lg font-bold text-text">John Doe</h2>
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
        {messages.map((message) => (
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

export default UsersPage;
