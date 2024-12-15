"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Upload, Avatar } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const nickName = localStorage.getItem("nickName");
    const dateOfBirth = localStorage.getItem("dateOfBirth");
    const avatarUrl = localStorage.getItem("avatarUrl");

    form.setFieldsValue({
      username,
      email,
      nickName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    });
    setAvatarUrl(avatarUrl);
  }, [form]);

  const handleAvatarChange = (info: any) => {
    if (info.file.status === "done") {
      // Get this url from response in real world.
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
      localStorage.setItem("avatarUrl", url);
    }
  };

  const onFinish = (values: any) => {
    console.log("Profile Updated:", values);
    localStorage.setItem("username", values.username);
    localStorage.setItem("nickName", values.nickName);
    localStorage.setItem("dateOfBirth", values.dateOfBirth.toISOString());
    // Handle profile update logic (e.g., API call)
  };

  return (
    <div className="flex justify-center items-center h-screen bg-light">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          User Profile
        </h2>

        <Form
          form={form}
          name="user_profile"
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
        >
          {/* Avatar Upload */}
          <Form.Item label="Avatar">
            <div className="flex justify-center">
                <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                onChange={handleAvatarChange}
                >
                {avatarUrl ? (
                    <Avatar src={avatarUrl} size={100} />
                ) : (
                    <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                )}
                </Upload>
            </div>
          </Form.Item>

          {/* Username Field */}
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input />
          </Form.Item>

          {/* Nickname Field */}
          <Form.Item label="Nickname" name="nickName">
            <Input />
          </Form.Item>

          {/* Date of Birth Field */}
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[
                { required: true, message: "Please select your date of birth!" },
            ]}
            >
            <DatePicker
                disabledDate={(current) => {
                return current && current.toDate() > new Date();
                }}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserProfile;
