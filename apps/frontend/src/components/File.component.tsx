import React, { useState } from "react";
import { Button, message, Spin } from "antd";

const FileView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Hardcoded file metadata
  const file = {
    id: "03f32685-f38e-4a50-b8cc-7a7bd7bf7e56",
    ownerId: "31137eb2-069d-4a50-b8cc-7a7bd7bf7e56",
    fileName: "IMG_1638.MP4",
    fileSize: "373762",
    s3Key: "31137eb2-069d-4a50-b8cc-7a7bd7bf7e56/1734881076928_IMG_1638.MP4",
    status: "PENDING",
    type: "video/mp4",
    category: "VIDEO",
    isFavorite: false,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
    owner: { name: "John Doe" }, // Mock owner details
  };

  // Hardcoded download URL
  const downloadUrl =
    "https://d1os3qjhk03lcq.cloudfront.net/31137eb2-069d-4a50-b8cc-7a7bd7bf7e56/1734881076928_IMG_1638.MP4?Expires=1736349169&Key-Pair-Id=KR54SWHU2CEU0&Signature=EqOFhws7BuCYMPpPclrOV93OVv3YaWYp-5Po8~k-~TtCf8zJWfyptbSLPRdlo9TIx3TNIADHpyRc-Qdg7Hu0wM-~kEbCg6b7527FLWsj8~Ae4qNJSaK~j5N8xU2s~nEYueCQkgXk6RcEDyt4ZpIN-xMb6VPv6KxrsP-NOrpI9~Lm6V8HNE5TT5KaLrGnF4SYNOkos~a~S3ZTCjC3lDtI0wctQzhVqfIib-rGui9fnahvcHBu-Q7gAHluEBE1NOUZ3VvECyP60L5qiNTBSr794GK8XCV3f1HGPffF5bfC5P8keOGP-lPnvB0I0x6u88T9EKEidbRXpVmjI5o-Gzfb7g__";

  const handleDownload = async () => {
    try {
      setLoading(true);

      const response = await fetch(downloadUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch the file from the download URL.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName || "download";
      a.click();
      window.URL.revokeObjectURL(url);

      message.success("File downloaded successfully.");
    } catch (error: any) {
      message.error(error.message || "Failed to download the file.");
    } finally {
      setLoading(false);
    }
  };

  const renderFilePreview = () => {
    if (file.type.startsWith("video")) {
      return (
        <video controls width="100%" className="rounded-lg shadow-md">
          <source src={downloadUrl} type={file.type} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (file.type.startsWith("image")) {
      return <img src={downloadUrl} alt={file.fileName} className="rounded-lg shadow-md" />;
    } else {
      return (
        <p className="text-gray-600">
          Preview is not available for this file type. You can download it using the button below.
        </p>
      );
    }
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }

  return (
    <div className="p-4 bg-white shadow-sm rounded-lg">
      <h1 className="text-xl font-semibold">{file.fileName}</h1>
      <p>Created: {new Date(file.createdAt).toLocaleDateString()}</p>
      <p>Last Modified: {new Date(file.updatedAt).toLocaleDateString()}</p>
      <p>Owner: {file.owner.name}</p>

      {/* File Preview */}
      <div className="my-4">{renderFilePreview()}</div>

      <Button type="primary" onClick={handleDownload}>
        Download File
      </Button>
    </div>
  );
};

export default FileView;
