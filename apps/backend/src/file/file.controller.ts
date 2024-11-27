import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateUploadUrlDto } from './dtos/create-upload-url.dto';
import { UploadUrlResponseDto } from './dtos/upload-url-response.dto';
import { UpdateMetadataDto } from './dtos/update-meta-data.dto';
import { SearchFilesDto } from './dtos/search-file.dto';
import { FILE_MESSAGES } from './constants/file.constants';
import { AuthGuard } from '@nestjs/passport';


@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload-url')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  async generateUploadUrl(
    @Body() createUploadUrlDto: CreateUploadUrlDto,
    @Req() req: any,
  ): Promise<{ message: string; data: UploadUrlResponseDto }> {
    const userId = req.user.id; // Extracted by JwtStrategy
    const data = await this.fileService.generateUploadUrl(createUploadUrlDto, userId);
    return {
      message: FILE_MESSAGES.UPLOAD_URL_SUCCESS,
      data,
    };
  }
}
