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
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UpdateMetadataRequest {
    id: string;
    fileName: string;
  }
  
  export interface SearchFilesRequest {
    query?: string;
    size?: number;
    date?: string;
  }
  
  export interface SearchFilesResponse {
    id: string;
    fileName: string;
    fileSize: bigint;
    type: string;
    category: string;
    createdAt: Date;
  }
  
  export interface DownloadUrlResponse {
    downloadUrl: string;
  }
  