'use client';

import { Form, Input, Button } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

const RegisterForm = () => {
    const onFinish = (values: any) => {
        console.log('Registration Successful:', values);
        // Replace with your registration logic (e.g., API call)
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
                    Create Your Account
                </h2>

                <Form
                    name="register_form"
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
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters!',
                            },
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
