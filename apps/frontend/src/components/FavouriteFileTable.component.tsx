import React, { useState, useEffect, useCallback } from "react";
import { Table, Avatar, Tooltip, Button, message } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { fileService } from "../services/file.service";
import { useNavigate } from "react-router-dom";
import type {
  FileMetadata,
  PaginationRequest,
} from "../models/file/file.model";
import type { TablePaginationConfig } from "antd/es/table";
import { favouritesService } from "../services/favourites.service";

interface FavouriteFilesTableProps {
  category?: string;
}

const FavouriteFilesTable: React.FC<FavouriteFilesTableProps> = ({ category }) => {
  const [fileData, setFileData] = useState<FileMetadata[]>([]);
  const [fileCount, setFileCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationRequest>({
    limit: 8,
    offset: 0,
    category,
  });

  const navigate = useNavigate();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);

      const [files, countResponse] = await Promise.all([
        favouritesService.getAllFavouriteFiles(pagination),
        favouritesService.getFavoriteFileCount(),
      ]);

      setFileData(files);
      setFileCount(countResponse);
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message || "Failed to fetch files.");
      } else {
        message.error("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  const toggleFavorite = async (key: string, isFavorite: boolean) => {
    try {
      await fileService.toggleFavorite(key, isFavorite);
      setFileData((prevData) =>
        prevData.map((file) =>
          file.id === key ? { ...file, isFavorite: !file.isFavorite } : file
        )
      );
    } catch {
      message.error("Failed to update favorite status.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, pagination, category]);

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    const currentPage = paginationConfig.current || 1;
    const pageSize = paginationConfig.pageSize || 8;

    setPagination((prev) => ({
      ...prev,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    }));
  };

  const columns = [
    {
      title: "Asset Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (text: string, record: FileMetadata) => (
        <span className="font-medium text-gray-700" onClick={() => navigate(`/files/${record.id}`)}>
          {text}
        </span>
      ),
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
          total: fileCount,
        }}
        rowKey={(record) => record.id}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default FavouriteFilesTable;
