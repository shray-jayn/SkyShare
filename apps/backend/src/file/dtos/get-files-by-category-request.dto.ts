import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFilesByCategoryRequestDto {
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  category: string;

  @IsNumber()
  @Type(() => Number)
  offset: number;

}
