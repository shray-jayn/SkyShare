import apiClient from "./api.service";
import {
  CreateUploadUrlRequest,
  CreateUploadUrlResponse,
  FileMetadata,
  UpdateMetadataRequest,
  SearchFilesRequest,
  SearchFilesResponse,
  DownloadUrlResponse,
} from "../models/file/file.model";

export const fileService = {
  async generateUploadUrl(payload: CreateUploadUrlRequest): Promise<CreateUploadUrlResponse> {
    try {
      const response = await apiClient.post("/files/upload-url", payload);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Insufficient storage quota.";
        throw new Error(errorMessage);
      }
      console.error("Failed to generate upload URL:", error);
      throw new Error("Unable to generate upload URL. Please try again.");
    }
  },

  async getAllFiles(): Promise<FileMetadata[]> {
    try {
      const response = await apiClient.get("/files");
      return response.data.data;
    } catch (error) {
      console.error("Failed to retrieve files:", error);
      throw new Error("Unable to retrieve files. Please try again.");
    }
  },

  async getFileMetadata(fileId: string): Promise<FileMetadata> {
    try {
      const response = await apiClient.get(`/files/${fileId}`);
      return response.data.data;
    } catch (error) {
      console.error("Failed to retrieve file metadata:", error);
      throw new Error("Unable to retrieve file metadata. Please try again.");
    }
  },

  async updateMetadata(
    payload: UpdateMetadataRequest
  ): Promise<FileMetadata> {
    try {
      const response = await apiClient.put("/files/metadata", payload);
      return response.data.data;
    } catch (error) {
      console.error("Failed to update file metadata:", error);
      throw new Error("Unable to update file metadata. Please try again.");
    }
  },

  async searchFiles(
    payload: SearchFilesRequest
  ): Promise<SearchFilesResponse[]> {
    try {
      const response = await apiClient.get("/files/search", { params: payload });
      return response.data.data;
    } catch (error) {
      console.error("Failed to search files:", error);
      throw new Error("Unable to search files. Please try again.");
    }
  },

  async generateDownloadUrl(fileId: string): Promise<DownloadUrlResponse> {
    try {
      const response = await apiClient.get(`/files/download-url/${fileId}`);
      return response.data.data;
    } catch (error) {
      console.error("Failed to generate download URL:", error);
      throw new Error("Unable to generate download URL. Please try again.");
    }
  },

  async deleteFile(fileId: string): Promise<void> {
    try {
      await apiClient.delete(`/files/${fileId}`);
    } catch (error) {
      console.error("Failed to delete file:", error);
      throw new Error("Unable to delete file. Please try again.");
    }
  },
};