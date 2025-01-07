import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileService } from './file.service';
import { CreateUploadUrlDto } from './dtos/create-upload-url.dto';
import { UploadUrlResponseDto } from './dtos/upload-url-response.dto';
import { UpdateMetadataDto } from './dtos/update-meta-data.dto';
import { SearchFilesDto } from './dtos/search-file.dto';
import { UpdateFileSizeDto } from './dtos/update-file-size.dto';
import { FILE_MESSAGES } from './constants/file.constants';
import { GetAllFilesResponseDto } from './dtos/get-all-files-response.dto';
import { FileMetadataResponseDto } from './dtos/file-metadata-response.dto';
import { SearchFilesResponseDto } from './dtos/search-files-response.dto';
import { DownloadUrlResponseDto } from './dtos/download-url-response.dto';
import { FileStatus } from '@prisma/client';
import { GetFilesByCategoryRequestDto } from './dtos/get-files-by-category-request.dto';
import { GetFilesCountByCategoryRequestDto } from './dtos/get-file-count-categort-request.dto';


@UseGuards(AuthGuard('jwt'))
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload-url')
  @HttpCode(HttpStatus.CREATED)
  async generateUploadUrl(
    @Body() createUploadUrlDto: CreateUploadUrlDto,
    @Req() req: any,
  ): Promise<{ message: string; data: UploadUrlResponseDto }> {
    const userId = req.user.id;
    const data = await this.fileService.generateUploadUrl(createUploadUrlDto, userId);
    return { message: FILE_MESSAGES.UPLOAD_URL_SUCCESS, data };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllFiles(
    @Req() req: any,
    @Query() getFilesDto:  GetFilesByCategoryRequestDto,
  ): Promise<{ message: string; data: GetAllFilesResponseDto[] }> {
    const userId = req.user.id;
    const files = await this.fileService.getAllFiles(userId, getFilesDto);
    return { message: FILE_MESSAGES.FILES_RETRIEVED_SUCCESS, data: files };
  }


  @Get('/count')
  @HttpCode(HttpStatus.OK)
  async getAllFilesCount(
    @Req() req: any,
    @Query() getFilesCategoryDto: GetFilesCountByCategoryRequestDto,
  ): Promise<{ count: number }> { 
    const userId = req.user.id;
    const count = await this.fileService.getAllFileCount(userId, getFilesCategoryDto);
    return { count };
  }


  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getFileMetadata(@Param('id') id: string): Promise<{ message: string; data: FileMetadataResponseDto }> {
    const metadata = await this.fileService.getFileMetadata(id);
    if (!metadata) {
      throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    }
    return { message: FILE_MESSAGES.FILE_METADATA_SUCCESS, data: metadata };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Param('id') id: string): Promise<{ message: string }> {
    await this.fileService.deleteFile(id);
    return { message: FILE_MESSAGES.FILE_DELETE_SUCCESS };
  }

  @Put('metadata')
  @HttpCode(HttpStatus.OK)
  async updateMetadata(
    @Body() updateMetadataDto: UpdateMetadataDto,
  ): Promise<{ message: string; data: FileMetadataResponseDto }> {
    const updatedFile = await this.fileService.updateMetadata(updateMetadataDto);
    return { message: FILE_MESSAGES.FILE_UPDATE_METADATA_SUCCESS, data: updatedFile };
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchFiles(
    @Query() searchFilesDto: SearchFilesDto,
    @Req() req: any,
  ): Promise<{ message: string; data: SearchFilesResponseDto[] }> {
    const userId = req.user.id;
    const results = await this.fileService.searchFiles(searchFilesDto, userId);
    return { message: FILE_MESSAGES.FILE_SEARCH_SUCCESS, data: results };
  }

  @Get('download-url/:id')
  @HttpCode(HttpStatus.OK)
  async generateDownloadUrl(
    @Param('id') id: string,
  ): Promise<{ message: string; data: DownloadUrlResponseDto }> {
    const downloadUrl = await this.fileService.generateDownloadUrl(id);
    return { message: FILE_MESSAGES.DOWNLOAD_URL_SUCCESS, data: downloadUrl };
  }

  @Post('upload-status')
  @HttpCode(HttpStatus.OK)
  async finalizeUpload(
    @Body() updateFileSizeDto: UpdateFileSizeDto,
  ): Promise<{ message: string }> {
    await this.fileService.finalizeUpload(updateFileSizeDto);
    return { message: FILE_MESSAGES.UPLOAD_FINALIZE_SUCCESS };
  }

  @Post('update-status/:id')
  @HttpCode(HttpStatus.OK)
  async updateFileStatus(
    @Param('id') fileId: string,
    @Body('status') status: FileStatus,
  ): Promise<{ message: string }> {
    return await this.fileService.updateFileStatus(fileId, status);
  }

  @Put('toggle-favorite/:id')
  @HttpCode(HttpStatus.OK)
  async toggleFavorite(
    @Param('id') fileId: string,
    @Body('isFavorite') isFavorite: boolean,
  ): Promise<{ message: string }> {
    return await this.fileService.toggleFavorite(fileId, isFavorite);
  }

}
