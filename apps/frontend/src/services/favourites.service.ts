import apiClient from "./api.service";
import { FileMetadata, PaginationRequest } from "../models/file/file.model";

export const favouritesService = {
  async getAllFavouriteFiles(pagination: PaginationRequest): Promise<FileMetadata[]> {
    try {
      const { limit, offset} = pagination;

      const response = await apiClient.get("/files/favorites", {
        params: { limit, offset },
      });

      return response.data.data.map((file: any) => ({
        ...file,
        createdAt: new Date(file.createdAt).toISOString(),
        updatedAt: new Date(file.updatedAt).toISOString(),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to retrieve favorite files.";
      console.error("Failed to retrieve favorite files:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async getFavoriteFileCount(): Promise<number> {
    try {
      const response = await apiClient.get("/files/count/favorites");
      return response.data.count;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to retrieve favorite file count.";
      console.error("Failed to retrieve favorite file count:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
