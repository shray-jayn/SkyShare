import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteFileResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
