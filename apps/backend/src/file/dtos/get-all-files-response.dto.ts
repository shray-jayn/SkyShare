export class GetAllFilesResponseDto {
  id: string;
  fileName: string;
  fileSize: bigint;
  type: string;
  category: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  owner: {
    name: string | null;
    profilePicture: string | null;
  };
}
