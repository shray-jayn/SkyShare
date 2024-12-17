import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccessService } from './access.service';
import { CreateShareLinkDto } from './dtos/create-share-link.dto';
import { AddAccessDto } from './dtos/add-access.dto';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_MESSAGES } from './constants/access.constants';

@Controller('share')
@UseGuards(AuthGuard('jwt'))
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post('/:fileId')
  @HttpCode(HttpStatus.CREATED)
  async createShareLink(
    @Param('fileId') fileId: string,
    @Body() createShareLinkDto: CreateShareLinkDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const data = await this.accessService.createShareLink(
      fileId,
      createShareLinkDto,
      userId,
    );
    return { message: ACCESS_MESSAGES.SHARE_LINK_SUCCESS, data };
  }

  @Get('/:linkToken')
  @HttpCode(HttpStatus.OK)
  async validateShareLink(@Param('linkToken') linkToken: string) {
    const signedUrl = await this.accessService.generateDownloadUrl(linkToken);
    return {
      message: ACCESS_MESSAGES.LINK_VALIDATION_SUCCESS,
      data: { signedUrl },
    };
  }

  @Delete('/:linkToken/revoke')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revokeShareLink(@Param('linkToken') linkToken: string) {
    await this.accessService.revokeShareLink(linkToken);
  }

  @Post('/:linkToken/access')
  @HttpCode(HttpStatus.CREATED)
  async addAccess(
    @Param('linkToken') linkToken: string,
    @Body() addAccessDto: AddAccessDto,
  ) {
    await this.accessService.addAccess(linkToken, addAccessDto);
    return { message: ACCESS_MESSAGES.ACCESS_ADDED_SUCCESS };
  }

  @Get('/:linkToken/access')
  @HttpCode(HttpStatus.OK)
  async listAccess(@Param('linkToken') linkToken: string) {
    const data = await this.accessService.listAccess(linkToken);
    return { message: ACCESS_MESSAGES.ACCESS_LIST_SUCCESS, data };
  }

  @Delete('/:linkToken/access/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAccess(
    @Param('linkToken') linkToken: string,
    @Param('id') accessId: string,
  ) {
    await this.accessService.removeAccess(linkToken, accessId);
  }
}
