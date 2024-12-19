'use client';

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authApiService } from '../../api/apiService';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/AuthContext'; // Import AuthContext

const AuthForm = () => {
  const router = useRouter();
  const { setUser } = React.useContext(AuthContext); // Get setUser from AuthContext

  const onFinish = async (values: any) => {
    console.log('Form Submitted:', values);
    try {
      const response = await authApiService.authLogin(values.email, values.password);
      console.log('Login Successful:', response);
      // Store user data in localStorage
      localStorage.setItem('username', response.user.username);
      localStorage.setItem('email', response.user.email);
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('nickName', response.user.nickName);
      localStorage.setItem('userId', response.user.userId);
      localStorage.setItem('accessToken', response.accessToken);

      const avatarUrl = response.user.avatarUrl;
      if (avatarUrl) {
        localStorage.setItem('avatarUrl', avatarUrl);
      } else {
        localStorage.setItem('avatarUrl', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwdIVSqaMsmZyDbr9mDPk06Nss404fosHjLg&s');
      }

      // Set user in AuthContext
      const user = {
        username: response.user.username,
        email: response.user.email,
        role: response.user.role,
        nickName: response.user.nickName,
        userId: response.user.userId,
        avatarUrl: response.user.avatarUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwdIVSqaMsmZyDbr9mDPk06Nss404fosHjLg&s',
        accessToken: response.accessToken,
      };
      setUser(user);

      // Redirect to user page
      router.push('/users/chat');
      message.success('Login Successful');
    } catch (error) {
      console.error('Login Failed:', error);
      // Handle login failure (e.g., show error message)
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Form Validation Failed:', errorInfo);
  };

  const handleGoogleSignIn = (response: any) => {
    console.log('Google OAuth Response:', response);
    // Add your API call here to handle Google Sign-In
  };

  return (
    <div className="flex justify-center items-center h-screen bg-light">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>

        <Form
          name="auth_form"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="space-y-6"
        >
          {/* Email Field */}
          <Form.Item
            label={<span className="text-lg text-gray-700">Email</span>}
            name="email"
            rules={[
              {
                required: true,
                message: 'Please enter your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter your email"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label={<span className="text-lg text-gray-700">Password</span>}
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
              // {
              //     min: 6,
              //     message: 'Password must be at least 6 characters!',
              // },
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter your password"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full text-lg font-medium"
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        {/* Google Sign-In Button */}
        <div
          id="google-signin-btn"
          className="w-full my-4 flex justify-center"
        ></div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
