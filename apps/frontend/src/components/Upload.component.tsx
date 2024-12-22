import React, { useEffect, useRef } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadProps } from "antd";
import { fileService } from "../services/file.service";
import type { CreateUploadUrlRequest, CreateUploadUrlResponse } from "../models/file/file.model";

const { Dragger } = Upload;

enum FileCategory {
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
  OTHER = "OTHER",
}

const determineFileCategory = (fileType: string): FileCategory => {
  if (fileType.startsWith("video/")) return FileCategory.VIDEO;
  if (fileType.startsWith("audio/")) return FileCategory.AUDIO;
  if (fileType.startsWith("image/")) return FileCategory.IMAGE;
  if (
    fileType === "application/pdf" ||
    fileType.startsWith("application/vnd") ||
    fileType.startsWith("text/")
  ) {
    return FileCategory.DOCUMENT;
  }
  return FileCategory.OTHER;
};

const UploadComponent: React.FC = () => {
  const uploadListRef = useRef<any[]>([]);

  const getDynamicUploadUrl = async (file: File): Promise<string> => {
    const category = determineFileCategory(file.type);

    const payload: CreateUploadUrlRequest = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      category,
    };

    try {
      const response: CreateUploadUrlResponse = await fileService.generateUploadUrl(payload);
      return response.data.uploadUrl;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to get upload URL.";
      // Only display one error message
      throw new Error(errorMessage);
    }
  };

  const clearUploadList = (fileList: any[]) => {
    setTimeout(() => {
      fileList.length = 0;
      uploadListRef.current = [];
    }, 1000);
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const uploadUrl = await getDynamicUploadUrl(file as File);

        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": (file as File).type,
          },
          body: file,
        });

        if (uploadResponse.ok) {
          onSuccess?.("File uploaded successfully", file);
          message.success(`${(file as File).name} uploaded successfully.`);

          // Clear upload list if all files are uploaded
          if (uploadListRef.current.every((item) => item.status === "done")) {
            clearUploadList(uploadListRef.current);
          }
        } else {
          throw new Error("Upload failed");
        }
      } catch (error: any) {
        const errorMessage = error.message || "Failed to upload file.";
        onError?.(new Error(errorMessage));
        message.error(errorMessage);
      }
    },
    onChange(info) {
      uploadListRef.current = info.fileList;

      const { status } = info.file;

      if (status === "done") {
        if (uploadListRef.current.every((item) => item.status === "done")) {
          clearUploadList(uploadListRef.current);
        }
      }

      if (status === "error") {
        // Display a single error message
        const existingError = uploadListRef.current.find(
          (item) => item.uid === info.file.uid && item.status === "error"
        );

        if (!existingError) {
          message.error(`${info.file.name} upload failed.`);
        }
      }
    },
    onDrop(e) {
      uploadListRef.current = Array.from(e.dataTransfer.files);
      message.info("Files added to upload list.");
    },
  };

  useEffect(() => {
    return () => {
      uploadListRef.current = [];
    };
  }, []);

  return (
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for single or bulk upload. Avoid uploading sensitive files.
      </p>
    </Dragger>
  );
};

export default UploadComponent;
