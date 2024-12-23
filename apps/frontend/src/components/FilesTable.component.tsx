import React, { useState, useEffect } from "react";
import { Table, Avatar, Tooltip, Button, message } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { fileService } from "../services/file.service";
import type { FileMetadata, PaginationRequest } from "../models/file/file.model";
import type { TablePaginationConfig } from "antd/es/table";

const RecentFilesTable: React.FC = () => {
  const [fileData, setFileData] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationRequest>({
    limit: 8,
    offset: 0, 
  });

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const files = await fileService.getAllFiles(pagination);
      setFileData(files);
    } catch (error: any) {
      message.error(error.message || "Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (key: string, isFavorite: boolean) => {
    try {
      await fileService.toggleFavorite(key, isFavorite);
      setFileData((prevData) =>
        prevData.map((file) =>
          file.id === key ? { ...file, isFavorite: !file.isFavorite } : file
        )
      );
    } catch (error: any) {
      message.error("Failed to update favorite status.");
    }
  };

  useEffect(() => {
    fetchFiles(); // Fetch data whenever pagination changes
  }, [pagination]);

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    // Calculate offset and limit for the clicked page
    const currentPage = paginationConfig.current || 1;
    const pageSize = paginationConfig.pageSize || 8;

    setPagination({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });
  };

  const columns = [
    {
      title: "Asset Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (text: string) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
      title: "Favorite",
      dataIndex: "isFavorite",
      key: "isFavorite",
      render: (isFavorite: boolean, record: FileMetadata) => (
        <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
          <Button
            type="text"
            icon={isFavorite ? <StarFilled style={{ color: "#fadb14" }} /> : <StarOutlined />}
            onClick={() => toggleFavorite(record.id, !isFavorite)}
          />
        </Tooltip>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Owner",
      dataIndex: "ownerAvatar",
      key: "ownerAvatar",
      render: (_: string, record: FileMetadata) => (
        <div className="flex items-center gap-2">
          <Avatar src={record.owner.profilePicture || `https://i.pravatar.cc/40?u=${record.id}`} />
          <span>{record.owner.name}</span>
        </div>
      ),
    },
    {
      title: "Last Modified",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-4 bg-white shadow-sm rounded-lg">
      <Table
        columns={columns}
        dataSource={fileData}
        loading={loading}
        pagination={{
          current: pagination.offset / pagination.limit + 1,
          pageSize: pagination.limit,
          total: 100, // Replace with actual total count from the backend
        }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default RecentFilesTable;
