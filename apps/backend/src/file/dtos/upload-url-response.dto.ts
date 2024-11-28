import { IsString, IsNotEmpty } from 'class-validator';

export class UploadUrlResponseDto {
  @IsString()
  @IsNotEmpty()
  uploadUrl: string;

  @IsString()
  @IsNotEmpty()
  s3Key: string;
}
