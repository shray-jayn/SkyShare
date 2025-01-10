import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fileService } from "../services/file.service";
import { Button, message, Spin } from "antd";
import type { FileMetadata } from "../models/file/file.model";
import '@react-pdf-viewer/core/lib/styles/index.css';
import PDFViewer from "./Pdf.component";

const FileView: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const [file, setFile] = useState<FileMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  // Fetch file details
  const fetchFileDetails = async () => {
    try {
      setLoading(true);

      const fileData = await fileService.getFileMetadata(fileId!);
      setFile(fileData);

      const downloadUrlResponse = await fileService.generateDownloadUrl(fileId!);
      setDownloadUrl(downloadUrlResponse.downloadUrl);
    } catch (error: any) {
      message.error(error.message || "Failed to fetch file details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file download
  const handleDownload = async () => {
    if (!downloadUrl) {
      message.error("Download URL is not available.");
      return;
    }

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
      a.download = file?.fileName || "download";
      a.click();
      window.URL.revokeObjectURL(url);

      message.success("File downloaded successfully.");
    } catch (error: any) {
      message.error(error.message || "Failed to download the file.");
    } finally {
      setLoading(false);
    }
  };

  // Render file preview
  const renderFilePreview = () => {
    if (!file || !downloadUrl) {
      return null;
    }

    if (file.type.startsWith("video")) {
      return (
        <video
          src={downloadUrl}
          controls
          width="100%"
          height="500px"
          className="rounded-lg shadow-md"
        >
          Your browser does not support the video tag.
        </video>
      );
    } else if (file.type.startsWith("image")) {
      return <img src={downloadUrl} alt={file.fileName} className="rounded-lg shadow-md" />;
    } else if (file.type.startsWith("audio")) {
      return (
        <audio src={downloadUrl} controls className="rounded-lg shadow-md">
          Your browser does not support the audio tag.
        </audio>
      );
    }
    else if (file.type === "application/pdf") {
      return <PDFViewer fileUrl={downloadUrl} />;
    }
    
    
     else if (
      [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type)
    ) {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            downloadUrl
          )}`}
          width="100%"
          height="500px"
          className="rounded-lg shadow-md"
          title={file.fileName}
        />
      );
    } else {
      return (
        <div className="text-center text-gray-600">
          <p className="mb-4">
            Preview is not available for this file type. You can download it using the button below.
          </p>
          <Button type="primary" onClick={() => window.open(downloadUrl, "_blank")}>
            Download File
          </Button>
        </div>
      );
    }
  };

  // Fetch details on component mount
  useEffect(() => {
    fetchFileDetails();
  }, [fileId]);

  // Loading spinner
  if (loading) {
    return <Spin size="large" className="flex justify-center items-center h-screen" />;
  }

  // Main render
  return (
    <div className="p-4 bg-white shadow-sm rounded-lg">
      {file ? (
        <>
          <h1 className="text-xl font-semibold mb-3">{file.fileName}</h1>
          <Button type="primary" onClick={handleDownload}>
            Download File
          </Button>

          {/* File Preview */}
          <div className="my-4">{renderFilePreview()}</div>

          
        </>
      ) : (
        <p className="text-center text-gray-600">File not found or failed to load.</p>
      )}
    </div>
  );
};

export default FileView;
