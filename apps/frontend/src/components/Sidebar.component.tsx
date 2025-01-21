import React, { useState } from "react";
import {
  HeartOutlined,
  MailOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, Progress, Avatar } from "antd";
import type { MenuProps } from "antd";
import { useRecoilValue } from "recoil";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import { authState } from "../recoil/atoms/auth.atom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "/",
    icon: <MailOutlined />,
    label: "Home",
  },
  {
    key: "/favourites",
    icon: <HeartOutlined />,
    label: "Favourites",
  },
  {
    key: "/shared",
    icon: <TeamOutlined />,
    label: "Shared",
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const [stateOpenKeys, setStateOpenKeys] = useState([location.pathname]); // Set based on current path
  const auth = useRecoilValue(authState); 

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    setStateOpenKeys(openKeys);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key); 
  };

  // Calculate used storage percentage
  const usedSpacePercentage = auth.user
    ? (Number(auth.user.usedStorage) / Number(auth.user.storageQuota)) * 100
    : 0;

  return (
    <div className="h-full flex flex-col bg-white border-r shadow-sm pr-4">
      {/* Logo Section */}
      <div className="flex justify-center items-center">
        <img
          src="https://img.freepik.com/premium-vector/cloud-logo-design-concept_761413-6571.jpg"
          alt="SkyShare"
          className="w-24"
        />
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]} 
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        onClick={handleMenuClick} 
        style={{ flex: 1 }}
        items={items}
      />

      {/* Used Space Section */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-2">Used Space</p>
        <Progress
          percent={usedSpacePercentage}
          status="active"
          format={(percent) => `${Math.round(percent || 0)}%`}
        />
        <a href="#" className="text-blue-600 text-xs">
          Upgrade Plan
        </a>
      </div>

      {/* User Profile */}
      <div className="flex items-center p-4 border-t">
        <Avatar size="large" icon={<UserOutlined />} />
        <div className="ml-3">
          <p className="font-semibold text-gray-700">{auth.user?.name || "Guest"}</p>
          <p className="text-sm text-gray-500">{auth.user?.email || "No email"}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
