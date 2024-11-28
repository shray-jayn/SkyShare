import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class SearchFilesDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsDateString()
  @IsOptional()
  date?: string;
}
