import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { authService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";

const LoginComponent: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authState); 

  const onFinish = async (values: any) => {
    const { email, password, remember } = values;

    try {
      const response = await authService.login({ email, password });

      if (!response || !response.token) {
        throw new Error("Invalid login credentials");
      }

      const { token, user } = response;

      setAuth({
        isAuthenticated: true,
        user,
        token,
      });

      if (remember) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      message.success("Login successful!");

      // Navigate to home page
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error.message === "Email or password is incorrect!") {
        message.error(error.message);
      } else {
        message.error("An error occurred while logging in. Please try again.");
      }
    }
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
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            {
              type: "email",
              message: "The input is not a valid Email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            className="rounded-lg"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your Password!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            className="rounded-lg"
          />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember Me</Checkbox>
        </Form.Item>
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
        <a href="/signup" className="text-blue-600">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default LoginComponent;
