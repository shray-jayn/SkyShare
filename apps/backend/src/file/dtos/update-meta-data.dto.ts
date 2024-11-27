import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMetadataDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  newFileName: string;
}
