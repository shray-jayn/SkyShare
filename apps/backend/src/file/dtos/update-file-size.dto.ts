import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class UpdateFileSizeDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsInt()
  @IsNotEmpty()
  fileSize: number;
}
