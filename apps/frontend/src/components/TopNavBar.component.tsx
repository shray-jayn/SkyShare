import React, { useState } from "react";
import { Button, Input, Modal, message } from "antd";
import { UploadOutlined, LogoutOutlined } from "@ant-design/icons";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { authState } from "../recoil/atoms/auth.atom";
import UploadComponent from "../components/Upload.component";
import { searchService } from "../services/search.service";

const { Search } = Input;

const TopNavBar: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    });

    message.success("You have been logged out.");
    navigate("/login");
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      message.warning("Please enter a valid search query.");
      return;
    }

    setLoading(true); // Show loader in the search bar
    try {
      const results = await searchService.searchFiles({ query, limit: 10, offset: 0 });
      navigate("/search", { state: { query, results } });
    } catch (error: any) {
      message.error("Failed to perform search. Please try again.");
      console.error("Search error:", error.message);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      <div className="flex items-center bg-white p-4 border-b shadow-sm">
        {/* Left Placeholder */}
        <div className="w-1/4"></div>

        {/* Centered Search Input */}
        <div className="w-full md:flex-1 flex justify-center mb-4 md:mb-0">
          <Search
            placeholder="Search..."
            enterButton="Search"
            size="large"
            className="w-full md:w-3/4 lg:w-1/2"
            loading={loading} // Loader only in the search bar
            onSearch={handleSearch} // Call search handler
          />
        </div>

        {/* Right Section Buttons */}
        <div className="w-1/4 flex justify-end gap-2">
          <Button
            type="default"
            icon={<UploadOutlined />}
            className="text-blue-600"
            onClick={showModal} // Open the modal
          >
            Upload
          </Button>
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            danger
            onClick={handleLogout} // Call logout handler
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        title="Upload Files"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Remove default footer buttons
        width={600}
      >
        <UploadComponent />
      </Modal>
    </>
  );
};

export default TopNavBar;
