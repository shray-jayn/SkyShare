import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFilesRequestDto {
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @Type(() => Number)
  offset: number;

  @IsOptional()
  orderBy?: { field: string; direction: string }[];
}
