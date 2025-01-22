import { IsOptional, IsString, IsArray, IsNumber, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DateRangeDto {
  @IsString()
  @IsOptional()
  from?: string;

  @IsString()
  @IsOptional()
  to?: string;
}

export class SearchRequestDto {
  @IsString()
  @IsOptional()
  query?: string;

  @IsArray()
  @IsOptional()
  @IsIn(['AUDIO', 'VIDEO', 'DOCUMENT', 'OTHER', 'IMAGE'], { each: true })
  type?: string[];

  @ValidateNested()
  @IsOptional()
  @Type(() => DateRangeDto)
  date?: DateRangeDto;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}
