import apiClient from "./api.service";
import { FileMetadata, PaginationRequest } from "../models/file/file.model";

export const sharedService = {
  async getAllSharedFiles(pagination: PaginationRequest): Promise<FileMetadata[]> {
    try {
      const { limit, offset } = pagination;

      const response = await apiClient.get("/files/shared", {
        params: { limit, offset},
      });

      return response.data.data.map((file: any) => ({
        ...file,
        createdAt: new Date(file.createdAt).toISOString(),
        updatedAt: new Date(file.updatedAt).toISOString(),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to retrieve shared files.";
      console.error("Failed to retrieve shared files:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async getSharedFileCount(): Promise<number> {
    try {
      const response = await apiClient.get("/files/count/shared");
      return response.data.count;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to retrieve shared file count.";
      console.error("Failed to retrieve shared file count:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
