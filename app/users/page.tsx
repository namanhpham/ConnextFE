import React from "react";
import { Input, Button, Row, Col } from "antd";

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
      <div className="flex-1 overflow-y-auto p-4 bg-light space-y-4">
        {/* Example Messages */}
        <Row justify="start">
          <Col>
            <div className="bg-secondary text-light p-3 rounded-lg max-w-xs">
              Hi there! How are you?
            </div>
          </Col>
        </Row>
        <Row justify="end">
          <Col>
            <div className="bg-highlight text-primary p-3 rounded-lg max-w-xs">
              I’m good! How about you?
            </div>
          </Col>
        </Row>
      </div>

      {/* Message Input */}
      <div className="bg-secondary p-4 flex items-center space-x-2">
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
