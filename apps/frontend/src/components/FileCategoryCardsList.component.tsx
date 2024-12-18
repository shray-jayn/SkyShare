import React from "react";
import {
  FileTextOutlined,
  PictureOutlined,
  AudioOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import FileCategoryCard from "./FileCategoryCard.component";

// Mock Data for File Categories
const fileCategories = [
  {
    id: 1,
    icon: <FileTextOutlined />,
    title: "Documents",
    count: 10,
    color: "#fbbf24", // Yellow
  },
  {
    id: 2,
    icon: <PictureOutlined />,
    title: "Pictures",
    count: 20,
    color: "#f87171", // Red
  },
  {
    id: 3,
    icon: <AudioOutlined />,
    title: "Audio",
    count: 5,
    color: "#60a5fa", // Blue
  },
  {
    id: 4,
    icon: <VideoCameraOutlined />,
    title: "Videos",
    count: 8,
    color: "#34d399", // Green
  },
];

const FileCategoryCardsList: React.FC = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {fileCategories.map((category) => (
        <FileCategoryCard
          key={category.id}
          icon={category.icon}
          title={category.title}
          count={category.count}
          color={category.color}
        />
      ))}
    </div>
  );
};

export default FileCategoryCardsList;
