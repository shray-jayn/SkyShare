import React, { useState, useEffect } from "react";
import {
  FileTextOutlined,
  PictureOutlined,
  AudioOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import FileCategoryCard from "./FileCategoryCard.component";
import { useNavigate } from "react-router-dom";
import { fileService } from "../services/file.service";
import { message } from "antd";

const FileCategoryCardsList: React.FC = () => {
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [audioCount, setAudioCount] = useState<number>(0);
  const [imageCount, setImageCount] = useState<number>(0);
  const [videoCount, setVideoCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);

      // Fetch counts for each category
      const [imageResponse, videoResponse, audioResponse, documentResponse] = await Promise.all([
        fileService.getAllFilesCount({ category: "IMAGE" }),
        fileService.getAllFilesCount({ category: "VIDEO" }),
        fileService.getAllFilesCount({ category: "AUDIO" }),
        fileService.getAllFilesCount({ category: "DOCUMENT" }),
      ]);

      // Set counts
      setImageCount(imageResponse);
      setVideoCount(videoResponse);
      setAudioCount(audioResponse);
      setDocumentCount(documentResponse);
    } catch (error: any) {
      message.error(error.message || "Failed to fetch file counts.");
    } finally {
      setLoading(false);
    }
  };

  // Updated categories with dynamic counts
  const fileCategories = [
    {
      id: 1,
      icon: <FileTextOutlined />,
      title: "Documents",
      count: documentCount,
      color: "#fbbf24", // Yellow
      route: "/documents",
    },
    {
      id: 2,
      icon: <PictureOutlined />,
      title: "Pictures",
      count: imageCount,
      color: "#f87171", // Red
      route: "/pictures",
    },
    {
      id: 3,
      icon: <AudioOutlined />,
      title: "Audio",
      count: audioCount,
      color: "#60a5fa", // Blue
      route: "/audios",
    },
    {
      id: 4,
      icon: <VideoCameraOutlined />,
      title: "Videos",
      count: videoCount,
      color: "#34d399", // Green
      route: "/videos",
    },
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {fileCategories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleCardClick(category.route)}
          className="cursor-pointer"
        >
          <FileCategoryCard
            icon={category.icon}
            title={category.title}
            count={loading ? 0 : category.count} 
            color={category.color}
          />
        </div>
      ))}
    </div>
  );
};

export default FileCategoryCardsList;
