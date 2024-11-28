import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { S3 } from 'aws-sdk';
import { FILE_MESSAGES } from './constants/file.constants';
import { CreateUploadUrlDto } from './dtos/create-upload-url.dto';
import { UploadUrlResponseDto } from './dtos/upload-url-response.dto';
import { UpdateMetadataDto } from './dtos/update-meta-data.dto';
import { SearchFilesDto } from './dtos/search-file.dto';
import { UpdateFileSizeDto } from './dtos/update-file-size.dto';
import { ShareFileDto } from './dtos/share-file.dto';
import * as crypto from 'crypto';

@Injectable()
export class FileService {
  private readonly s3: S3;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async generateUploadUrl(
    createUploadUrlDto: CreateUploadUrlDto,
    userId: string,
  ): Promise<UploadUrlResponseDto> {
    const { fileName, fileType } = createUploadUrlDto;

    this.validateInput(fileName, fileType);
    const s3Key = this.generateS3Key(userId, fileName);
    const bucketName = this.getBucketName();

    try {
      const uploadUrl = await this.getPresignedUrl(s3Key, fileType, bucketName);
      await this.saveFileMetadata(userId, fileName, s3Key);
      return { uploadUrl, s3Key };
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.UPLOAD_URL_ERROR);
    }
  }

  async getAllFiles(userId: string) {
    return await this.prisma.file.findMany({ where: { ownerId: userId } });
  }
  
  async getFileMetadata(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    return file;
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.getFileMetadata(fileId);
    const bucketName = this.getBucketName();

    try {
      await this.s3.deleteObject({ Bucket: bucketName, Key: file.s3Key }).promise();
      await this.prisma.file.delete({ where: { id: fileId } });
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.FILE_DELETE_FAILED);
    }
  }

  async updateMetadata(updateMetadataDto: UpdateMetadataDto) {
    const { id, fileName } = updateMetadataDto;

    try {
      return await this.prisma.file.update({
        where: { id },
        data: { fileName },
      });
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.FILE_UPDATE_METADATA_FAILED);
    }
  }

  async searchFiles(searchFilesDto: SearchFilesDto, userId: string) {
    const { query, size, date } = searchFilesDto;

    try {
      return await this.prisma.file.findMany({
        where: {
          ownerId: userId,
          AND: [
            query ? { fileName: { contains: query, mode: 'insensitive' } } : {},
            size ? { fileSize: { lte: size } } : {},
            date ? { createdAt: { gte: new Date(date) } } : {},
          ],
        },
      });
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.FILE_SEARCH_FAILED);
    }
  }

  async generateDownloadUrl(fileId: string): Promise<string> {
    const file = await this.getFileMetadata(fileId);
    const bucketName = this.getBucketName();

    try {
      return await this.s3.getSignedUrlPromise('getObject', {
        Bucket: bucketName,
        Key: file.s3Key,
        Expires: 3600, // 1 hour
      });
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.DOWNLOAD_URL_FAILED);
    }
  }

  async finalizeUpload(updateFileSizeDto: UpdateFileSizeDto): Promise<void> {
    const { fileId, fileSize } = updateFileSizeDto;

    try {
      const file = await this.prisma.file.update({
        where: { id: fileId },
        data: { fileSize },
      });

      if (!file) throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.UPLOAD_FINALIZE_FAILED);
    }
  }

  async shareFile(fileId: string, shareFileDto: ShareFileDto): Promise<string> {
    const { permission, expiryDate } = shareFileDto;
    const file = await this.getFileMetadata(fileId);

    const linkToken = this.generateToken();
    const shareLink = `https://yourdomain.com/share/${fileId}?token=${linkToken}`;

    try {
      await this.prisma.link.create({
        data: {
          fileId,
          linkToken,
          permissions: permission,
          expiryDate,
        },
      });
      return shareLink;
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.SHARE_LINK_FAILED);
    }
  }

  private generateToken(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private validateInput(fileName: string, fileType: string): void {
    if (!fileName || !fileType) {
      throw new BadRequestException(FILE_MESSAGES.INVALID_INPUT);
    }
  }

  private generateS3Key(userId: string, fileName: string): string {
    return `${userId}/${Date.now()}_${fileName}`;
  }

  private getBucketName(): string {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucketName) {
      throw new InternalServerErrorException('S3 bucket name is not configured.');
    }
    return bucketName;
  }

  private async getPresignedUrl(
    s3Key: string,
    fileType: string,
    bucketName: string,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Expires: 3600, // 1 hour
      ContentType: fileType,
    };
    return await this.s3.getSignedUrlPromise('putObject', params);
  }

  private async saveFileMetadata(
    userId: string,
    fileName: string,
    s3Key: string,
  ): Promise<void> {
    await this.prisma.file.create({
      data: {
        ownerId: userId,
        fileName,
        fileSize: 0,
        s3Key,
      },
    });
  }

  private handleInternalError(error: any, message: string): void {
    console.error(error); 
    throw new InternalServerErrorException(message);
  }
}
