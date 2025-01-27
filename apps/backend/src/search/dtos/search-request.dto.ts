import { IsOptional, IsString, IsArray, IsNumber, IsIn, ValidateNested } from 'class-validator';
export class SearchRequestDto {
  @IsString()
  query?: string;
  
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}
