import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, Input, Progress, Avatar } from "antd";
import type { MenuProps } from "antd";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";

const { Search } = Input;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "1",
    icon: <MailOutlined />,
    label: "Home",
  },
  {
    key: "2",
    icon: <AppstoreOutlined />,
    label: "Dashboard",
    children: [
      { key: "21", label: "Overview" },
      { key: "22", label: "Notifications" },
      { key: "23", label: "Recently Deleted" },
    ],
  },
  {
    key: "3",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

const Sidebar: React.FC = () => {
  const [stateOpenKeys, setStateOpenKeys] = useState(["2"]);
  const auth = useRecoilValue(authState); // Access auth state

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    setStateOpenKeys(openKeys);
  };

  console.log(auth.user);

  // Calculate used storage percentage
  const usedSpacePercentage = auth.user
    ? Number(auth.user.usedStorage) / Number(auth.user.storageQuota) * 100
    : 0;

  return (
    <div className="h-full flex flex-col bg-white border-r shadow-sm">
      {/* Search Input */}
      <div className="p-4">
        <Search placeholder="Search" allowClear />
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        defaultSelectedKeys={["21"]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
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
