import { IsString } from 'class-validator';

export class GetShareLinkTokenResponseDto {
  @IsString()
  linkToken: string;
}