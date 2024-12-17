import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { LinkVisibility, Permission } from '@prisma/client';

export class CreateShareLinkDto {
  @IsEnum(LinkVisibility)
  visibility: LinkVisibility;

  @IsEnum(Permission)
  permissions: Permission;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
