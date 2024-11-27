import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;
}
