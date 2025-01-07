import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFilesCountByCategoryRequestDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  category: string;
}
