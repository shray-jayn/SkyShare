import { IsString } from 'class-validator';

export class GetShareLinkTokenRequestDto {
  @IsString()
  fileId: string;
}