import { IsNotEmpty, IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import { Permission } from '@prisma/client';

export class ShareFileDto {
  @IsEnum(Permission)
  @IsNotEmpty()
  permission: Permission;

  @IsOptional()
  @IsISO8601()
  expiryDate?: string;
}
