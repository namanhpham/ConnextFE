'use client';

import { Form, Input, Button } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { authLogin } from '../../api/apiService'; // Import the authLogin function
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

declare global {
    interface Window {
        google: any; // You can replace `any` with specific types if available.
    }
}

const AuthForm = () => {
    const router = useRouter();

    const onFinish = async (values: any) => {
        console.log('Form Submitted:', values);
        try {
            const response = await authLogin(values.email, values.password);
            console.log('Login Successful:', response);
            // Store user data in localStorage
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('email', response.user.email);
            localStorage.setItem('role', response.user.role);
            localStorage.setItem('avatarUrl', response.avatarUrl);
            localStorage.setItem('nickName', response.nickName);
            // Redirect to user page
            router.push('/users');
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
