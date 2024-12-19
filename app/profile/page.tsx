"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Upload, Avatar, Layout, Menu, Dropdown, message } from "antd";
import { UploadOutlined, MessageOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import moment from "moment"; // Import moment for date handling
import { authApiService } from "@/app/api/apiService";
import { uploadToS3 } from "../api/utils/uploadImg";
import { disconnectSocket } from "../utils/socket";

const { Sider, Content } = Layout;

const UserProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const defaultAvatarUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwdIVSqaMsmZyDbr9mDPk06Nss404fosHjLg&s"; // Default avatar URL

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const nickName = localStorage.getItem("nickName");
    const dateOfBirth = localStorage.getItem("dateOfBirth");
    const storedAvatarUrl = localStorage.getItem("avatarUrl");

    form.setFieldsValue({
      username,
      email,
      nickName,
      dateOfBirth: dateOfBirth ? moment(dateOfBirth) : null, // Use moment to handle date
    });
    setAvatarUrl(storedAvatarUrl || defaultAvatarUrl);
  }, [form]);

  const handleAvatarChange = async (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      message.error("File size should be less than 25MB");
      return false;
    }

    const response = await uploadToS3(file);
    const url = response.fileUrl;
    setAvatarUrl(url);
    message.success("Avatar uploaded successfully");
    return false;
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(defaultAvatarUrl);
    localStorage.setItem("avatarUrl", defaultAvatarUrl);
    message.success("Avatar removed successfully");
  };

  const onFinish = async (values: any) => {
    console.log("Profile Updated:", values);
    const userId = localStorage.getItem("userId");
    const profileData = {
      username: values.username,
      nickName: values.nickName,
      avatarUrl: avatarUrl,
      dateOfBirth: values.dateOfBirth.toISOString(),
    };
    try {
      if (userId) {
        await authApiService.updateProfile(profileData, userId);
        message.success("Profile updated successfully");
      } else {
        console.error("User ID is null");
        message.error("Profile update failed");
      }
      localStorage.setItem("username", values.username);
      localStorage.setItem("nickName", values.nickName);
      localStorage.setItem("dateOfBirth", values.dateOfBirth.toISOString());
      if (avatarUrl) {
        localStorage.setItem("avatarUrl", avatarUrl);
      }
      // Handle successful profile update (e.g., show success message)
    } catch (error) {
      console.error("Profile Update Failed:", error);
      // Handle profile update failure (e.g., show error message)
    }
  };

  const handleLogout = async () => {
    try {
      await authApiService.authLogout();
      localStorage.clear();
      // Redirect to sign-in page
      router.push("/sign-in");
      disconnectSocket();
    } catch (error) {
      console.error("Logout Failed:", error);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={handleProfileClick}>Profile Settings</Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="h-screen text-black">
      {/* Smaller Sidebar for profile navigation */}
      <Sider width={80} className="bg-primary flex flex-col items-center p-4 border-r">
        <Dropdown overlay={userMenu} trigger={["click"]}>
          <Avatar src={avatarUrl} className="cursor-pointer mb-4" />
        </Dropdown>
        <div className="flex flex-col items-center space-y-4 mt-auto">
          <Button type="text" icon={<MessageOutlined />} onClick={() => router.push("/users/chat")} />
          <Button type="text" icon={<UserOutlined />} onClick={() => router.push("/users/friends")} />
          <Button type="text" icon={<TeamOutlined />} onClick={() => router.push("/users/groups")} />
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Main Content */}
        <Content className="flex justify-center items-center h-screen bg-light">
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
                <div className="flex justify-center relative">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={handleAvatarChange}
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
                
                {avatarUrl && avatarUrl !== defaultAvatarUrl && (
                    <div className="flex justify-center">
                        <Button
                            type="default"
                            onClick={handleRemoveAvatar}
                            className="mt-2"
                        >
                        Remove Avatar
                        </Button>
                    </div>
                )}
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserProfile;
