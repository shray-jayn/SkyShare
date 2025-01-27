import apiClient from "./api.service";
import { SearchRequestDto } from "../models/search/search-request.dto";

export const searchService = {
  async searchFiles(payload: SearchRequestDto): Promise<any[]> {
    try {
      const response = await apiClient.post("/search", payload);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Unable to perform search operation.";
      console.error("Failed to search files:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
