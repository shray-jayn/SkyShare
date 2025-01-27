import React from "react";
import { Table, Tag } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/main.layout";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const { query, results = [] } = location.state || { query: "", results: [] }; // Extract query and results from state

  const navigate = useNavigate();

  const columns = [
    {
      title: "File Name",
      dataIndex: "fileName",
      key: "fileName",
      render: (text: string, record: any) => (
        <span
          className="font-medium text-gray-700 cursor-pointer"
          onClick={() => navigate(`/files/${record.id}`)} // Navigate to file detail page
        >
          {text}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => {
        const colorMap: Record<string, string> = {
          VIDEO: "blue",
          IMAGE: "green",
          DOCUMENT: "orange",
          AUDIO: "purple",
        };
        return <Tag color={colorMap[category] || "default"}>{category}</Tag>;
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string | Record<string, any>) => {
        if (!date || typeof date !== "string") {
          return "N/A"; // Handle missing or invalid date
        }
        return new Date(date).toLocaleDateString(); // Format date
      },
    },
  ];

  return (
    <MainLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">
          Search Results for "{query}"
        </h2>
        {results.length > 0 ? (

          <div className="p-4 bg-white shadow-sm rounded-lg">
            <Table
            dataSource={results.map((item: any) => ({
              ...item,
              key: item.id, // Add unique key for each row
            }))}
            columns={columns}
            pagination={{ pageSize: 8 }} // Optional: Pagination settings
          />
          </div>
          
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
