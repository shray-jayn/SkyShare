import { IsEmail, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Permission } from '@prisma/client';

export class AddAccessDto {
  @IsEmail()
  email: string;

  @IsEnum(Permission)
  permissionLevel: Permission;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
