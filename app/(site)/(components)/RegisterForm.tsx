'use client';

import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authApiService } from '../../api/apiService'; // Import the authRegister function
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const RegisterForm = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        console.log('Registration Successful:', values);
        try {
            const response = await authApiService.authRegister(values.email, values.password, values.username);
            console.log('Registration Successful:', response);
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
            // Redirect to user page
            router.push('/users/chat');
            message.success('Registration Successful');
        } catch (error) {
            console.error('Registration Failed:', error);
            // Handle registration failure (e.g., show error message)
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Form Validation Failed:', errorInfo);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-light">
            <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Create Your Account
                </h2>

                <Form
                    name="register_form"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="space-y-6"
                >
                    {/* Username Field */}
                    <Form.Item
                        label={<span className="text-lg text-gray-700">Username</span>}
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your username!',
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Enter your username"
                        />
                    </Form.Item>

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
                            placeholder="Create a password"
                        />
                    </Form.Item>

                    {/* Confirm Password Field */}
                    <Form.Item
                        label={<span className="text-lg text-gray-700">Confirm Password</span>}
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error('Passwords do not match!')
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Confirm your password"
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
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>

                {/* Google Sign-In Button */}
                <div id="google-signin-btn" className="w-full my-4 flex justify-center"></div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
