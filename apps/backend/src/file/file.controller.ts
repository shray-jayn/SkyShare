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
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateUploadUrlDto } from './dtos/create-upload-url.dto';
import { UploadUrlResponseDto } from './dtos/upload-url-response.dto';
import { UpdateMetadataDto } from './dtos/update-meta-data.dto';
import { SearchFilesDto } from './dtos/search-file.dto';
import { FILE_MESSAGES } from './constants/file.constants';
import { AuthGuard } from '@nestjs/passport';
import { UpdateFileSizeDto } from './dtos/update-file-size.dto';
import { ShareFileDto } from './dtos/share-file.dto';

@UseGuards(AuthGuard('jwt')) 
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/upload-url')
  @HttpCode(HttpStatus.CREATED)
  async generateUploadUrl(
    @Body() createUploadUrlDto: CreateUploadUrlDto,
    @Req() req: any,
  ): Promise<{ message: string; data: UploadUrlResponseDto }> {
    const userId = req.user.id;
    const data = await this.fileService.generateUploadUrl(createUploadUrlDto, userId);
    return {
      message: FILE_MESSAGES.UPLOAD_URL_SUCCESS,
      data,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllFiles(@Req() req: any): Promise<{ message: string; data: any }> {
    const userId = req.user.id;
    const files = await this.fileService.getAllFiles(userId);
    return {
      message: FILE_MESSAGES.FILES_RETRIEVED_SUCCESS,
      data: files,
    };
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getFileMetadata(@Param('id') id: string): Promise<{ message: string; data: any }> {
    const metadata = await this.fileService.getFileMetadata(id);
    if (!metadata) {
      throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    }
    return {
      message: FILE_MESSAGES.FILE_METADATA_SUCCESS,
      data: metadata,
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('id') id: string): Promise<void> {
    await this.fileService.deleteFile(id);
  }

  @Put('/metadata')
  @HttpCode(HttpStatus.OK)
  async updateMetadata(
    @Body() updateMetadataDto: UpdateMetadataDto,
  ): Promise<{ message: string; data: any }> {
    const updatedFile = await this.fileService.updateMetadata(updateMetadataDto);
    return {
      message: FILE_MESSAGES.FILE_UPDATE_METADATA_SUCCESS,
      data: updatedFile,
    };
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  async searchFiles(
    @Query() searchFilesDto: SearchFilesDto,
    @Req() req: any,
  ): Promise<{ message: string; data: any }> {
    const userId = req.user.id;
    const results = await this.fileService.searchFiles(searchFilesDto, userId);
    return {
      message: FILE_MESSAGES.FILE_SEARCH_SUCCESS,
      data: results,
    };
  }

  @Get('/download-url/:id')
  @HttpCode(HttpStatus.OK)
  async generateDownloadUrl(
    @Param('id') id: string,
  ): Promise<{ message: string; data: { downloadUrl: string } }> {
    const downloadUrl = await this.fileService.generateDownloadUrl(id);
    return {
      message: FILE_MESSAGES.DOWNLOAD_URL_SUCCESS,
      data: { downloadUrl },
    };
  }

  @Post('/upload-status')
  @HttpCode(HttpStatus.OK)
  async finalizeUpload(
    @Body() updateFileSizeDto: UpdateFileSizeDto,
  ): Promise<{ message: string }> {
    await this.fileService.finalizeUpload(updateFileSizeDto);
    return {
      message: FILE_MESSAGES.UPLOAD_FINALIZE_SUCCESS,
    };
  }

  @Post('/share/:id')
  @HttpCode(HttpStatus.CREATED)
  async shareFile(
    @Param('id') id: string,
    @Body() shareFileDto: ShareFileDto,
  ): Promise<{ message: string; data: { shareLink: string } }> {
    const shareLink = await this.fileService.shareFile(id, shareFileDto);
    return {
      message: FILE_MESSAGES.SHARE_LINK_SUCCESS,
      data: { shareLink },
    };
  }
}
