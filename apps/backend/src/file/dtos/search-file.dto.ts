import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';

export class SearchFilesDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  minSize?: number;

  @IsInt()
  @IsOptional()
  maxSize?: number;

  @IsDateString()
  @IsOptional()
  createdAfter?: string;

  @IsDateString()
  @IsOptional()
  createdBefore?: string;
}
