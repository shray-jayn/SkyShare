
export interface PaginationRequest {
  limit: number;
  offset: number;
  category?: string;
}

export interface CountRequest {
  category?: string;
}

export interface OrderByField {
  field: "fileName" | "updatedAt" | "createdAt";
  direction: "asc" | "desc";
}

export interface CreateUploadUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
}

export interface CreateUploadUrlResponse {
  message: string;
  data: {
    uploadUrl: string;
    s3Key: string;
  };
}

export interface FileMetadata {
  id: string;
  fileName: string;
  fileSize: bigint;
  type: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  owner: {
    name: string;
    profilePicture?: string | null;
  };
}

export interface UpdateMetadataRequest {
  id: string;
  fileName: string;
}


export interface DownloadUrlResponse {
  downloadUrl: string;
}

export enum FileStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}
