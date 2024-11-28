import { IsString, IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class FileMetadataResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsNumber()
  @IsNotEmpty()
  fileSize: number;

  @IsString()
  @IsNotEmpty()
  s3Key: string;

  @IsDateString()
  @IsNotEmpty()
  createdAt: string;
}
