import React from "react";
import { Table, Avatar, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

// Define Data Structure
interface FileDataType {
  key: string;
  name: string;
  tag: string;
  created: string;
  owner: string;
  avatar: string; // Owner's avatar URL
  lastModified: string;
}

// Sample Data for the Table
const data: FileDataType[] = [
  {
    key: "1",
    name: "Task images",
    tag: "#defect",
    created: "12 Oct 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=1",
    lastModified: "1 day ago",
  },
  {
    key: "2",
    name: "id.jpg",
    tag: "#3ddesign",
    created: "1 Oct 2025",
    owner: "Furuya Rei",
    avatar: "https://i.pravatar.cc/40?img=2",
    lastModified: "14 days ago",
  },
  {
    key: "3",
    name: "Assets",
    tag: "#3dgtlf",
    created: "14 Feb 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=3",
    lastModified: "2 days ago",
  },
  {
    key: "4",
    name: "Documentation",
    tag: "#document",
    created: "27 Feb 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=4",
    lastModified: "8 days ago",
  },
  {
    key: "5",
    name: "Task images",
    tag: "#defect",
    created: "12 Oct 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=1",
    lastModified: "1 day ago",
  },
  {
    key: "6",
    name: "id.jpg",
    tag: "#3ddesign",
    created: "1 Oct 2025",
    owner: "Furuya Rei",
    avatar: "https://i.pravatar.cc/40?img=2",
    lastModified: "14 days ago",
  },
  {
    key: "7",
    name: "Assets",
    tag: "#3dgtlf",
    created: "14 Feb 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=3",
    lastModified: "2 days ago",
  },
  {
    key: "8",
    name: "Documentation",
    tag: "#document",
    created: "27 Feb 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=4",
    lastModified: "8 days ago",
  },
  {
    key: "9",
    name: "Task images",
    tag: "#defect",
    created: "12 Oct 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=1",
    lastModified: "1 day ago",
  },
  {
    key: "10",
    name: "id.jpg",
    tag: "#3ddesign",
    created: "1 Oct 2025",
    owner: "Furuya Rei",
    avatar: "https://i.pravatar.cc/40?img=2",
    lastModified: "14 days ago",
  },
  {
    key: "11",
    name: "Assets",
    tag: "#3dgtlf",
    created: "14 Feb 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=3",
    lastModified: "2 days ago",
  },
  {
    key: "12",
    name: "Documentation",
    tag: "#document",
    created: "27 Feb 2025",
    owner: "Shuichi Akai",
    avatar: "https://i.pravatar.cc/40?img=4",
    lastModified: "8 days ago",
  },
];

// Define Table Columns
const columns: ColumnsType<FileDataType> = [
  {
    title: "Asset Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <span className="font-medium text-gray-700">{text}</span>,
  },
  {
    title: "Tag",
    dataIndex: "tag",
    key: "tag",
    render: (tag) => <Tag color="blue">{tag}</Tag>,
  },
  {
    title: "Created",
    dataIndex: "created",
    key: "created",
  },
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    render: (text, record) => (
      <div className="flex items-center gap-2">
        <Avatar src={record.avatar} />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Last Modified",
    dataIndex: "lastModified",
    key: "lastModified",
  },
];

const RecentFilesTable: React.FC = () => {
  return (
    <div className="p-4 bg-white shadow-sm rounded-lg">
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
    </div>
  );
};

export default RecentFilesTable;
