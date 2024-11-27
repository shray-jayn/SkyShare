import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { S3 } from 'aws-sdk';
import { FILE_MESSAGES } from './constants/file.constants';
import { CreateUploadUrlDto } from './dtos/create-upload-url.dto';
import { UploadUrlResponseDto } from './dtos/upload-url-response.dto';

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

    // Validate input
    this.validateInput(fileName, fileType);

    // Generate a unique S3 key
    const s3Key = this.generateS3Key(userId, fileName);
    const bucketName = this.getBucketName();

    try {
      // Generate a pre-signed URL for upload
      const uploadUrl = await this.getPresignedUrl(s3Key, fileType, bucketName);

      // Save metadata in the database
      await this.saveFileMetadata(userId, fileName, s3Key);

      return { uploadUrl, s3Key };
    } catch (error) {
      throw new InternalServerErrorException(FILE_MESSAGES.UPLOAD_URL_ERROR);
    }
  }

  // Helper to validate input
  private validateInput(fileName: string, fileType: string): void {
    if (!fileName || !fileType) {
      throw new BadRequestException(FILE_MESSAGES.INVALID_INPUT);
    }
  }

  // Helper to generate unique S3 key
  private generateS3Key(userId: string, fileName: string): string {
    return `${userId}/${Date.now()}_${fileName}`;
  }

  // Helper to fetch bucket name from config
  private getBucketName(): string {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    if (!bucketName) {
      throw new InternalServerErrorException('S3 bucket name is not configured.');
    }
    return bucketName;
  }

  // Helper to generate a pre-signed URL
  private async getPresignedUrl(
    s3Key: string,
    fileType: string,
    bucketName: string,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: s3Key,
      Expires: 3600, // URL valid for 1 hour
      ContentType: fileType,
    };
    return await this.s3.getSignedUrlPromise('putObject', params);
  }

  // Helper to save metadata in the database
  private async saveFileMetadata(
    userId: string,
    fileName: string,
    s3Key: string,
  ): Promise<void> {
    await this.prisma.file.create({
      data: {
        ownerId: userId,
        fileName,
        fileSize: 0, // Placeholder size until the upload is finalized
        s3Key,
      },
    });
  }
}
