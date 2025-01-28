import apiClient from "./api.service";
import {
  CreateShareLinkRequest,
  CreateShareLinkResponse,
  AddAccessRequest,
  AccessListResponse,
  GetShareLinkTokenResponse,
} from "../models/access/access.model";

export const accessService = {
  async createShareLink(
    fileId: string,
    payload: CreateShareLinkRequest
  ): Promise<CreateShareLinkResponse> {
    console.log("createShareLink called with fileId:", fileId);
    console.log("Payload:", payload);

    try {
      console.log("Sending POST request to API...");
      const response = await apiClient.post(`/share/${fileId}`, payload);

      console.log("Full API response:", response);
      console.log("API response data:", response.data);

      if (!response.data || !response.data.data) {
        console.error("Unexpected API response format:", response.data);
        throw new Error("API returned an unexpected response format.");
      }

      // Log filename
      console.log("Share link created for file:", response.data.data.filename);
      console.log("Shareable link:", response.data.data.url);

      return response.data.data; // Return the full data object including filename
    } catch (error) {
      console.error("Failed to create share link:", error);
      throw new Error("Unable to create share link. Please try again later.");
    }
  },

  async validateShareLink(linkToken: string): Promise<{ signedUrl: string }> {
    try {
      const response = await apiClient.get(`/share/${linkToken}`);
      return response.data;
    } catch (error) {
      console.error("Failed to validate share link:", error);
      throw new Error("Invalid or expired share link.");
    }
  },

  async revokeShareLink(linkToken: string): Promise<void> {
    try {
      await apiClient.delete(`/share/${linkToken}/revoke`);
    } catch (error) {
      console.error("Failed to revoke share link:", error);
      throw new Error("Unable to revoke share link. Please try again later.");
    }
  },

  async addAccess(linkToken: string, payload: AddAccessRequest): Promise<void> {
    try {
      await apiClient.post(`/share/${linkToken}/access`, payload);
    } catch (error) {
      console.error("Failed to add access:", error);
      throw new Error("Unable to add access. Please try again later.");
    }
  },

  async listAccess(linkToken: string): Promise<AccessListResponse> {
    try {
      const response = await apiClient.get(`/share/${linkToken}/access`);
      return response.data;
    } catch (error) {
      console.error("Failed to list access:", error);
      throw new Error("Unable to fetch access list. Please try again later.");
    }
  },

  async removeAccess(linkToken: string, accessId: string): Promise<void> {
    try {
      await apiClient.delete(`/share/${linkToken}/access/${accessId}`);
    } catch (error) {
      console.error("Failed to remove access:", error);
      throw new Error("Unable to remove access. Please try again later.");
    }
  },

  // ✅ New function to get Share Link Token
  async getShareLinkToken(fileId: string): Promise<GetShareLinkTokenResponse> {
    console.log("Fetching share link token for fileId:", fileId);

    try {
      const response = await apiClient.get(`/share/token/${fileId}`);

      console.log("API response received:", response.data);

      if (!response.data || !response.data.data) {
        console.error("Unexpected API response format:", response.data);
        throw new Error("API returned an unexpected response format.");
      }

      console.log("Share link token:", response.data.data.linkToken);
      return response.data.data; // Return the linkToken
    } catch (error) {
      console.error("Failed to fetch share link token:", error);
      throw new Error("Unable to retrieve share link token. Please try again later.");
    }
  },
};
