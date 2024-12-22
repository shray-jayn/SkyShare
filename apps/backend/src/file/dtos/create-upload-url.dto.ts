import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { FileCategory } from '@prisma/client'; 
export class CreateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;

  @IsNumber()
  @IsNotEmpty()
  fileSize: number; 

  @IsEnum(FileCategory) 
  @IsNotEmpty()
  category: FileCategory; 
}
