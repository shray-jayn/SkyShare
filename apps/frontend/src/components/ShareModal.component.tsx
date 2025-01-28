import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Select, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { accessService } from "../services/access.service";
import { FileMetadata } from "../models/file/file.model";

interface ShareModalProps {
  file: FileMetadata;
  isVisible: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ file, isVisible, onClose }) => {
  const [email, setEmail] = useState("");
  const [userMessage, setUserMessage] = useState(""); // Renamed to avoid conflict
  const [linkToken, setLinkToken] = useState("");
  const [accessLevel, setAccessLevel] = useState("VIEW");

  const handleCopyLink = async () => {
    console.log("[Component File] handleCopyLink called");

    try {
      const response = await accessService.createShareLink(file.id, {
        visibility: "PUBLIC",
        permissions: accessLevel,
      });
      const token = response.linkToken;
      setLinkToken(token);
      navigator.clipboard.writeText(response.url);
      console.log("[Component File] Link copied to clipboard:", response.url);
    } catch (error) {
      console.error("[Component File] Error generating share link:", error);
    }
  };

  const handleAddAccess = async () => {
    if (!email) {
      message.warning("Please provide an email address.");
      return;
    }

    try {
      await accessService.addAccess(linkToken, {
        email,
        permissionLevel: accessLevel,
      });

      message.success(`Access granted to ${email}`);
      setEmail("");
    } catch (error) {
      message.error("Failed to add access. Please try again.");
    }
  };


  useEffect(() => {
    handleCopyLink()
  }, [file.id]);

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
            Add email
          </label>
          <Input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="primary" className="mt-2" onClick={handleAddAccess}>
            Add Access
          </Button>
        </div>

        {/* <div>
          <label className="block text-sm font-semibold mb-2">Message</label>
          <Input.TextArea
            placeholder="Write a message (optional)"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            rows={3}
          />
        </div> */}

        {/* General Access Section */}
        {/* <div>
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
                { value: "VIEW", label: "Viewer" },
                { value: "EDIT", label: "Editor" },
                { value: "DELETE", label: "Delete" },
                { value: "COMMENT", label: "Comment" },
              ]}
            />
          </div>
        </div> */}

        {/* Copy Link Button */}
        {/* <div className="mt-4 flex items-center justify-between">
          <Button type="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleCopyLink}>
            Copy Link
          </Button>
        </div> */}
      </div>
    </Modal>
  );
};

export default ShareModal;
