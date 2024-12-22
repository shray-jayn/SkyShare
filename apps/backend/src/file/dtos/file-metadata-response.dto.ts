export class FileMetadataResponseDto {
    id: string;
    fileName: string;
    fileSize: bigint;
    type: string;
    category: string;
    s3Key: string;
    createdAt: Date;
    updatedAt: Date;
  }
  