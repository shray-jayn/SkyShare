import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";

const LoginComponent: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Hello Again!</h2>
      <p className="text-gray-500 mb-6 leading-relaxed">
        Alquam consectetur et tincidunt praesent enim massa pellentesque.
      </p>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-4"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            className="rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            className="rounded-lg"
          />
        </Form.Item>
        <Flex justify="space-between" align="center" className="mb-2">
          <Checkbox>Remember Me</Checkbox>
          <a href="#" className="text-blue-600">
            Recovery Password
          </a>
        </Flex>
        <Button
          type="primary"
          htmlType="submit"
          block
          className="bg-blue-600 hover:bg-blue-700"
        >
          Log in
        </Button>
      </Form>
      <p className="mt-4 text-sm">
        or{" "}
        <a href="#" className="text-blue-600">
          Sign in with Google
        </a>
      </p>
      <p className="mt-4 text-sm">
        Don’t have an account yet?{" "}
        <a href="#" className="text-blue-600">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default LoginComponent;
