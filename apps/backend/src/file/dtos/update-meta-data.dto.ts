import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateMetadataDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  fileName: string;
}
