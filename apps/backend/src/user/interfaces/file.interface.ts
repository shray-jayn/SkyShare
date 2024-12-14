export interface File {
  id: string;
  fileName: string;
  fileSize: number;
  s3Key: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}
