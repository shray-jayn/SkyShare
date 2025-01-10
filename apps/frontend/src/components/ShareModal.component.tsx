import React, { useState } from "react";
import { Modal, Button, Input, Select } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { FileMetadata } from "../models/file/file.model";

interface ShareModalProps {
    file: FileMetadata;
    isVisible: boolean;
    onClose: () => void;
  }

const ShareModal: React.FC<ShareModalProps> = ({ file, isVisible, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [accessLevel, setAccessLevel] = useState("Viewer");

  const handleCopyLink = () => {
    const shareLink = `https://your-app.com/share/${file.id}`;
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  return (
    <Modal
      title={`Share "${file.fileName}"`}
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="space-y-4">
        {/* Add People Section */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Add people, groups, or email
          </label>
          <Input
            placeholder="Enter email or group"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Message</label>
          <Input.TextArea
            placeholder="Write a message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* General Access Section */}
        <div>
          <h3 className="font-semibold">General access</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-3">
              <span className="bg-green-500 text-white w-6 h-6 flex items-center justify-center rounded-full">
                <CopyOutlined />
              </span>
              <div>
                <p className="text-sm font-medium">Anyone with the link</p>
                <p className="text-xs text-gray-500">
                  Anyone on the internet with the link can view
                </p>
              </div>
            </div>
            <Select
              value={accessLevel}
              onChange={setAccessLevel}
              className="w-28"
              options={[
                { value: "Viewer", label: "Viewer" },
                { value: "Editor", label: "Editor" },
              ]}
            />
          </div>
        </div>

        {/* Copy Link Button */}
        <div className="mt-4 flex items-center justify-between">
          <Button type="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleCopyLink}>
            Copy Link
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
