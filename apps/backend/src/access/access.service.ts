import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ACCESS_MESSAGES } from './constants/access.constants';
import { CreateShareLinkDto } from './dtos/create-share-link.dto';
import { AddAccessDto } from './dtos/add-access.dto';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import * as crypto from 'crypto';

@Injectable()
export class AccessService {
  private readonly cloudFrontKeyPairId: string;
  private readonly cloudFrontPrivateKey: string;
  private readonly cloudFrontDomain: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.cloudFrontKeyPairId = this.configService.get<string>('CLOUDFRONT_KEYPAIR_ID');
    this.cloudFrontPrivateKey = this.configService.get<string>('CLOUDFRONT_PRIVATE_KEY');
    this.cloudFrontDomain = this.configService.get<string>('CLOUDFRONT_DOMAIN');
    console.log('AccessService initialized with CloudFront configurations.');
  }

  async createShareLink(fileId: string, createShareLinkDto: CreateShareLinkDto, userId: string): Promise<any> {
    console.log('Creating share link for file:', fileId, 'by user:', userId);
    try {
      const { permissions, visibility, expiryDate } = createShareLinkDto;

      const file = await this.prisma.file.findUnique({
        where: { id: fileId, ownerId: userId },
      });

      if (!file) {
        console.error('File not found:', fileId);
        throw new NotFoundException(ACCESS_MESSAGES.SHARE_LINK_NOT_FOUND);
      }

      const linkToken = crypto.randomBytes(16).toString('hex');
      console.log('Generated link token:', linkToken);

      const shareLink = await this.prisma.link.create({
        data: {
          fileId,
          linkToken,
          permissions,
          visibility,
          expiryDate,
        },
      });

      console.log('Share link created:', shareLink);

      return {
        linkToken: shareLink.linkToken,
        url: `${this.configService.get<string>('APP_BASE_URL')}/share/${shareLink.linkToken}`,
        expiryDate,
      };
    } catch (error) {
      console.error('Error creating share link:', error);
      throw new InternalServerErrorException(ACCESS_MESSAGES.SHARE_LINK_CREATION_FAILED, error);
    }
  }

  async generateDownloadUrl(linkToken: string): Promise<string> {
    console.log('Generating download URL for link token:', linkToken);
    try {
      const link = await this.prisma.link.findUnique({
        where: { linkToken },
        include: { file: true },
      });

      if (!link) {
        console.error('Invalid link token:', linkToken);
        throw new NotFoundException(ACCESS_MESSAGES.LINK_TOKEN_INVALID);
      }

      if (link.expiryDate && new Date() > link.expiryDate) {
        console.error('Share link expired:', linkToken);
        throw new BadRequestException(ACCESS_MESSAGES.SHARE_LINK_EXPIRED);
      }

      const s3Key = link.file.s3Key;
      console.log('File S3 key:', s3Key);

      const signedUrl = getSignedUrl({
        url: `${this.cloudFrontDomain}/${s3Key}`,
        keyPairId: this.cloudFrontKeyPairId,
        privateKey: this.cloudFrontPrivateKey,
        dateLessThan: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      console.log('Generated signed URL:', signedUrl);
      return signedUrl;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw new InternalServerErrorException(ACCESS_MESSAGES.DOWNLOAD_URL_FAILED, error);
    }
  }

  async revokeShareLink(linkToken: string): Promise<void> {
    console.log('Revoking share link for token:', linkToken);
    try {
      const link = await this.prisma.link.findUnique({ where: { linkToken } });

      if (!link) {
        console.error('Share link not found:', linkToken);
        throw new NotFoundException(ACCESS_MESSAGES.SHARE_LINK_NOT_FOUND);
      }

      await this.prisma.link.delete({ where: { id: link.id } });
      console.log('Share link revoked:', linkToken);
    } catch (error) {
      console.error('Error revoking share link:', error);
      throw new InternalServerErrorException(ACCESS_MESSAGES.SHARE_LINK_REVOKE_FAILED, error);
    }
  }

  async addAccess(linkToken: string, addAccessDto: AddAccessDto): Promise<void> {
    console.log('Adding access for link token:', linkToken, 'with details:', addAccessDto);
    try {
      const link = await this.prisma.link.findUnique({ where: { linkToken } });

      if (!link) {
        console.error('Invalid link token:', linkToken);
        throw new NotFoundException(ACCESS_MESSAGES.LINK_TOKEN_INVALID);
      }

      await this.prisma.access.create({
        data: {
          linkId: link.id,
          email: addAccessDto.email,
          permissionLevel: addAccessDto.permissionLevel,
          expiryDate: addAccessDto.expiryDate,
        },
      });

      console.log('Access added for email:', addAccessDto.email);
    } catch (error) {
      console.error('Error adding access:', error);
      if (error.code === 'P2002') {
        throw new BadRequestException(ACCESS_MESSAGES.ACCESS_ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(ACCESS_MESSAGES.ADD_ACCESS_FAILED, error);
    }
  }

  async listAccess(linkToken: string): Promise<any[]> {
    console.log('Listing access for link token:', linkToken);
    try {
      const link = await this.prisma.link.findUnique({
        where: { linkToken },
        include: { accesses: true },
      });

      if (!link) {
        console.error('Invalid link token:', linkToken);
        throw new NotFoundException(ACCESS_MESSAGES.LINK_TOKEN_INVALID);
      }

      console.log('Accesses found:', link.accesses);
      return link.accesses.map((access) => ({
        id: access.id,
        email: access.email,
        permissionLevel: access.permissionLevel,
        expiryDate: access.expiryDate,
      }));
    } catch (error) {
      console.error('Error listing access:', error);
      throw new InternalServerErrorException(ACCESS_MESSAGES.LIST_ACCESS_FAILED, error);
    }
  }

  async removeAccess(linkToken: string, accessId: string): Promise<void> {
    console.log('Removing access with ID:', accessId, 'for link token:', linkToken);
    try {
      const link = await this.prisma.link.findUnique({
        where: { linkToken },
      });

      if (!link) {
        console.error('Invalid link token:', linkToken);
        throw new NotFoundException(ACCESS_MESSAGES.LINK_TOKEN_INVALID);
      }

      const access = await this.prisma.access.findUnique({
        where: { id: accessId },
      });

      if (!access) {
        console.error('Access not found for ID:', accessId);
        throw new NotFoundException(ACCESS_MESSAGES.ACCESS_NOT_FOUND);
      }

      await this.prisma.access.delete({ where: { id: accessId } });
      console.log('Access removed for ID:', accessId);
    } catch (error) {
      console.error('Error removing access:', error);
      throw new InternalServerErrorException(ACCESS_MESSAGES.REMOVE_ACCESS_FAILED, error);
    }
  }
}
