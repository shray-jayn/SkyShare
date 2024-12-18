import React from "react";
import { Button, Form, Input, Checkbox } from "antd";
import { GoogleOutlined, AppleOutlined } from "@ant-design/icons";

const SignUpComponent: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div>
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-2 text-center">Get Started Now</h2>
      <p className="text-gray-500 mb-6 text-center">
        Enter your credentials to access your account
      </p>

      {/* Social Login */}
      <div className="flex justify-center gap-4 mb-4">
        <Button icon={<GoogleOutlined />} className="w-1/2 border-gray-300">
          Sign-up with Google
        </Button>
        <Button icon={<AppleOutlined />} className="w-1/2 border-gray-300">
          Sign-up with Apple
        </Button>
      </div>

      <div className="text-center text-gray-400 mb-6">or</div>

      {/* Form */}
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input your Name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email address"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Confirm Password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-between items-center text-sm">
            <Checkbox>I agree to the Terms & Privacy</Checkbox>
          </div>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-blue-600 hover:bg-blue-700"
          >
            Login
          </Button>
        </Form.Item>
      </Form>

      <p className="text-center text-sm mt-4">
        Have an account?{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default SignUpComponent;
