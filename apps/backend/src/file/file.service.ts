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
import { GetAllFilesResponseDto } from './dtos/get-all-files-response.dto';
import { FileMetadataResponseDto } from './dtos/file-metadata-response.dto';
import { SearchFilesResponseDto } from './dtos/search-files-response.dto';
import { DownloadUrlResponseDto } from './dtos/download-url-response.dto';
import { FileCategory, FileStatus, Prisma } from '@prisma/client';
import { GetFilesByCategoryRequestDto } from './dtos/get-files-by-category-request.dto';
import { GetFilesCountByCategoryRequestDto } from './dtos/get-file-count-categort-request.dto';


@Injectable()
export class FileService {
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async generateUploadUrl(createUploadUrlDto: CreateUploadUrlDto, userId: string): Promise<UploadUrlResponseDto> {
    try {
      const { fileName, fileType, fileSize, category } = createUploadUrlDto;
  
      // Validate file input
      this.validateFileInput(fileName, fileType);
  
      // Fetch user and check storage quota
      const user = await this.getUserById(userId);
      this.ensureStorageQuota(user, fileSize);
  
      // Generate S3 key and signed URL
      const s3Key = this.generateS3Key(userId, fileName);
      const uploadUrl = await this.createSignedS3Url(s3Key, fileType);
  
      // Save file metadata and update user's used storage
      await this.saveFileMetadata(userId, fileName, fileType, category, s3Key, BigInt(fileSize));
      await this.updateUsedStorage(userId, BigInt(fileSize));
  
      return { uploadUrl, s3Key };
    } catch (error) {
      // Rethrow known exceptions
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
  
      // Log and throw generic server-side error for unexpected issues
      console.error('Error generating upload URL:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.UPLOAD_URL_ERROR);
    }
  }
  

  async deleteFile(fileId: string): Promise<{ message: string }> {
    try {
      const file = await this.getFileMetadata(fileId);

      await this.deleteS3Object(file.s3Key);
      await this.prisma.file.delete({ where: { id: fileId } });

      return { message: FILE_MESSAGES.FILE_DELETE_SUCCESS };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_DELETE_FAILED);
    }
  }

  async updateMetadata(updateMetadataDto: UpdateMetadataDto): Promise<FileMetadataResponseDto> {
    try {
      const { id, fileName } = updateMetadataDto;
      return await this.prisma.file.update({ where: { id }, data: { fileName } });
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_UPDATE_METADATA_FAILED);
    }
  }

  async searchFiles(searchFilesDto: SearchFilesDto, userId: string): Promise<SearchFilesResponseDto[]> {
    try {
      const { query, size, date } = searchFilesDto;
      const filters = this.buildSearchFilters(query, size, date, userId);

      return await this.prisma.file.findMany({ where: filters });
    } catch (error) {
      console.error('Error searching files:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_SEARCH_FAILED);
    }
  }

  async generateDownloadUrl(fileId: string): Promise<DownloadUrlResponseDto> {
    try {
      const file = await this.getFileMetadata(fileId);
      const cloudFrontDomain = this.getConfig('CLOUDFRONT_DOMAIN');
      
      const fileUrl = `${cloudFrontDomain}/${file.s3Key}`;
      const signedUrl = this.createCloudFrontSignedUrl(fileUrl);

      return { downloadUrl: signedUrl };
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.DOWNLOAD_URL_FAILED);
    }
  }

  async finalizeUpload(updateFileSizeDto: UpdateFileSizeDto): Promise<void> {
    try {
      const { fileId, fileSize } = updateFileSizeDto;
      const file = await this.prisma.file.update({ where: { id: fileId }, data: { fileSize } });

      if (!file) throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    } catch (error) {
      console.error('Error finalizing upload:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.UPLOAD_FINALIZE_FAILED);
    }
  }

  async getAllFiles(
    userId: string,
    getFilesDto: GetFilesByCategoryRequestDto,
  ): Promise<GetAllFilesResponseDto[]> {
    const { limit, category, offset } = getFilesDto;
  
    try {
      
    
      const whereClause: Prisma.FileWhereInput = {
        ownerId: userId,
        ...(category ? { category: category as FileCategory } : {}), 
      };
  
      // Fetch files with owner information
      const files = await this.prisma.file.findMany({
        where: whereClause,
        take: limit,
        skip: offset,
        include: {
          owner: {
            select: {
              name: true,
              profilePicture: true,
            },
          },
        },
      });
  
      // Map files and include owner's name and profile picture in the response
      return files.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        fileSize: file.fileSize,
        type: file.type,
        category: file.category,
        isFavorite: file.isFavorite,
        status: file.status,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
        owner: {
          name: file.owner?.name || null,
          profilePicture: file.owner?.profilePicture || null,
        },
      }));
    } catch (error) {
      console.error("Error retrieving files with pagination and ordering:", error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_RETRIEVE_FAILED);
    }
  }

  async getFileMetadata(fileId: string): Promise<FileMetadataResponseDto> {
    try {
      const file = await this.prisma.file.findUnique({ where: { id: fileId } });
      if (!file) throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
      return file;
    } catch (error) {
      console.error('Error retrieving file metadata:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
    }
  }

  async getAllFileCount(userId: string, getFilesCategoryDto: GetFilesCountByCategoryRequestDto ): Promise<number> {
    try {
     const {category} = getFilesCategoryDto;

     const whereClause: Prisma.FileWhereInput = {
      ownerId: userId,
      ...(category ? { category: category as FileCategory } : {}), 
    };
      const count = await this.prisma.file.count({
        where: whereClause,
      });
      return count;
    } catch (error) {
      console.error(`Failed to fetch file count for user: ${userId}`, error);
      throw new InternalServerErrorException('Failed to fetch total file count');
    } 
  }

  async updateFileStatus(fileId: string, status: FileStatus): Promise<{ message: string }> {
    try {
      await this.prisma.file.update({ where: { id: fileId }, data: { status } });
      return { message: FILE_MESSAGES.FILE_UPDATE_METADATA_SUCCESS };
    } catch (error) {
      console.error('Error updating file status:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_UPDATE_METADATA_FAILED);
    }
  }

  async toggleFavorite(fileId: string, isFavorite: boolean): Promise<{ message: string }> {
    try {
      await this.prisma.file.update({ where: { id: fileId }, data: { isFavorite } });
      return { message: isFavorite ? FILE_MESSAGES.FILE_METADATA_SUCCESS : FILE_MESSAGES.FILE_METADATA_NOT_FOUND };
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_UPDATE_METADATA_FAILED);
    }
  }

  private validateFileInput(fileName: string, fileType: string): void {
    if (!fileName || !fileType) throw new BadRequestException(FILE_MESSAGES.INVALID_INPUT);
  }

  private async getUserById(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException(FILE_MESSAGES.FILE_METADATA_NOT_FOUND);
      return user;
    } catch (error) {
      console.error('Error retrieving user:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_RETRIEVE_FAILED);
    }
  }

  private ensureStorageQuota(user: any, fileSize: number): void {
    const remainingStorage = user.storageQuota - user.usedStorage;
    if (BigInt(fileSize) > remainingStorage) {
      throw new BadRequestException(FILE_MESSAGES.INSUFFICIENT_STORAGE); 
    }
  }

  private generateS3Key(userId: string, fileName: string): string {
    return `${userId}/${Date.now()}_${fileName}`;
  }

  private async createSignedS3Url(s3Key: string, fileType: string): Promise<string> {
    try {
      const bucketName = this.getConfig('AWS_S3_BUCKET');
      const command = new PutObjectCommand({ Bucket: bucketName, Key: s3Key, ContentType: fileType });

      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error('Error creating signed S3 URL:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.UPLOAD_URL_ERROR);
    }
  }

  private async saveFileMetadata(
    userId: string,
    fileName: string,
    fileType: string,
    category: FileCategory,
    s3Key: string,
    fileSize: bigint,
  ): Promise<void> {
    try {
      await this.prisma.file.create({ data: { ownerId: userId, fileName, type: fileType, category, s3Key, fileSize } });
    } catch (error) {
      console.error('Error saving file metadata:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_METADATA_SAVE_FAILED);
    }
  }

  private async updateUsedStorage(userId: string, fileSize: bigint): Promise<void> {
    try {
      const user = await this.getUserById(userId);
      await this.prisma.user.update({ where: { id: userId }, data: { usedStorage: user.usedStorage + fileSize } });
    } catch (error) {
      console.error('Error updating user storage:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_RETRIEVE_FAILED);
    }
  }

  private async deleteS3Object(s3Key: string): Promise<void> {
    try {
      const bucketName = this.getConfig('AWS_S3_BUCKET');
      const command = new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Error deleting S3 object:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.FILE_DELETE_FAILED);
    }
  }

  private buildSearchFilters(query: string, size: number, date: string, userId: string): any {
    return {
      ownerId: userId,
      AND: [
        query ? { fileName: { contains: query, mode: 'insensitive' } } : {},
        size ? { fileSize: { lte: size } } : {},
        date ? { createdAt: { gte: new Date(date) } } : {},
      ],
    };
  }

  private getConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) throw new InternalServerErrorException(`${key} is not configured.`);
    return value;
  }

  private createCloudFrontSignedUrl(fileUrl: string): string {
    try {
      return getCloudFrontSignedUrl({
        url: fileUrl,
        keyPairId: this.getConfig('CLOUDFRONT_KEYPAIR_ID'),
        privateKey: this.getConfig('CLOUDFRONT_PRIVATE_KEY'),
        dateLessThan: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch (error) {
      console.error('Error creating CloudFront signed URL:', error);
      throw new InternalServerErrorException(FILE_MESSAGES.DOWNLOAD_URL_FAILED);
    }
  }
}
