import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getCloudFrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import { FILE_MESSAGES } from './constants/file.constants';
import { CreateUploadUrlDto } from './dtos/create-upload-url.dto';
import { UploadUrlResponseDto } from './dtos/upload-url-response.dto';
import { UpdateMetadataDto } from './dtos/update-meta-data.dto';
import { SearchFilesDto } from './dtos/search-file.dto';
import { UpdateFileSizeDto } from './dtos/update-file-size.dto';

@Injectable()
export class FileService {
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // Initialize AWS S3 Client
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
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
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        ContentType: fileType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600, // 1 hour
      });

      await this.saveFileMetadata(userId, fileName, s3Key);
      return { uploadUrl, s3Key };
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.UPLOAD_URL_ERROR);
    }
  }

  async deleteFile(fileId: string): Promise<{ message: string }> {
    const file = await this.getFileMetadata(fileId);
    if (!file) {
      throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    }

    const bucketName = this.getBucketName();

    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: file.s3Key,
      });

      await this.s3Client.send(command);
      await this.prisma.file.delete({ where: { id: fileId } });

      return { message: FILE_MESSAGES.FILE_DELETE_SUCCESS };
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
      this.handleInternalError(
        error,
        FILE_MESSAGES.FILE_UPDATE_METADATA_FAILED,
      );
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
    const cloudFrontDomain =
      this.configService.get<string>('CLOUDFRONT_DOMAIN');

    if (!cloudFrontDomain) {
      throw new InternalServerErrorException(
        'CloudFront domain is not configured.',
      );
    }

    try {
      const fileUrl = `${cloudFrontDomain}/${file.s3Key}`;

      return getCloudFrontSignedUrl({
        url: fileUrl,
        keyPairId: this.configService.get<string>('CLOUDFRONT_KEYPAIR_ID'),
        privateKey: this.configService.get<string>('CLOUDFRONT_PRIVATE_KEY'),
        dateLessThan: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day expiry
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

      if (!file)
        throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    } catch (error) {
      this.handleInternalError(error, FILE_MESSAGES.UPLOAD_FINALIZE_FAILED);
    }
  }

  async getAllFiles(userId: string) {
    return await this.prisma.file.findMany({ where: { ownerId: userId } });
  }

  async getFileMetadata(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file)
      throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    return file;
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
      throw new InternalServerErrorException(
        'S3 bucket name is not configured.',
      );
    }
    return bucketName;
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
        fileSize: 0, // Placeholder size
        s3Key,
      },
    });
  }

  private handleInternalError(error: any, message: string): void {
    console.error(error);
    throw new InternalServerErrorException(message);
  }
}
