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
    this.cloudFrontKeyPairId = this.configService.get<string>(
      'CLOUDFRONT_KEYPAIR_ID',
    );
    this.cloudFrontPrivateKey = this.configService.get<string>(
      'CLOUDFRONT_PRIVATE_KEY',
    );
    this.cloudFrontDomain = this.configService.get<string>('CLOUDFRONT_DOMAIN');
  }

  // 1. Create a shareable link
  async createShareLink(
    fileId: string,
    createShareLinkDto: CreateShareLinkDto,
    userId: string,
  ): Promise<any> {
    try {
      const { permissions, visibility, expiryDate } = createShareLinkDto;

      const file = await this.prisma.file.findUnique({
        where: { id: fileId, ownerId: userId },
      });

      if (!file)
        throw new NotFoundException(ACCESS_MESSAGES.SHARE_LINK_NOT_FOUND);

      const linkToken = crypto.randomBytes(16).toString('hex');

      const shareLink = await this.prisma.link.create({
        data: {
          fileId,
          linkToken,
          permissions,
          visibility,
          expiryDate,
        },
      });

      return {
        linkToken: shareLink.linkToken,
        url: `${this.configService.get<string>('APP_BASE_URL')}/share/${shareLink.linkToken}`,
        expiryDate,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        ACCESS_MESSAGES.SHARE_LINK_CREATION_FAILED,
        error,
      );
    }
  }

  // 2. Generate short-lived CloudFront signed URL
  async generateDownloadUrl(linkToken: string): Promise<string> {
    try {
      const link = await this.prisma.link.findUnique({
        where: { linkToken },
        include: { file: true },
      });

      if (!link)
        throw new NotFoundException(ACCESS_MESSAGES.LINK_TOKEN_INVALID);

      if (link.expiryDate && new Date() > link.expiryDate) {
        throw new BadRequestException(ACCESS_MESSAGES.SHARE_LINK_EXPIRED);
      }

      const s3Key = link.file.s3Key;

      const signedUrl = getSignedUrl({
        url: `${this.cloudFrontDomain}/${s3Key}`,
        keyPairId: this.cloudFrontKeyPairId,
        privateKey: this.cloudFrontPrivateKey,
        dateLessThan: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day expiry
      });

      return signedUrl;
    } catch (error) {
      throw new InternalServerErrorException(
        ACCESS_MESSAGES.DOWNLOAD_URL_FAILED,
        error,
      );
    }
  }
  // 3. Revoke a shareable link
  async revokeShareLink(linkToken: string): Promise<void> {
    try {
      const link = await this.prisma.link.findUnique({ where: { linkToken } });

      if (!link)
        throw new NotFoundException(ACCESS_MESSAGES.SHARE_LINK_NOT_FOUND);

      await this.prisma.link.delete({ where: { id: link.id } });
    } catch (error) {
      throw new InternalServerErrorException(
        ACCESS_MESSAGES.SHARE_LINK_REVOKE_FAILED,
        error,
      );
    }
  }

  // 4. Add access to a restricted link
  async addAccess(
    linkToken: string,
    addAccessDto: AddAccessDto,
  ): Promise<void> {
    const { email, permissionLevel, expiryDate } = addAccessDto;

    try {
      const link = await this.prisma.link.findUnique({ where: { linkToken } });

      if (!link)
        throw new NotFoundException(ACCESS_MESSAGES.LINK_TOKEN_INVALID);

      await this.prisma.access.create({
        data: {
          linkId: link.id,
          email,
          permissionLevel,
          expiryDate,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Prisma unique constraint error
        throw new BadRequestException(ACCESS_MESSAGES.ACCESS_ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(
        ACCESS_MESSAGES.ADD_ACCESS_FAILED,
        error,
      );
    }
  }

  // 5. List all users with access to a link
  async listAccess(linkToken: string): Promise<any[]> {
    try {
      const link = await this.prisma.link.findUnique({
        where: { linkToken },
        include: { accesses: true },
      });

      if (!link)
        throw new NotFoundException(ACCESS_MESSAGES.LINK_TOKEN_INVALID);

      return link.accesses.map((access) => ({
        id: access.id,
        email: access.email,
        permissionLevel: access.permissionLevel,
        expiryDate: access.expiryDate,
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        ACCESS_MESSAGES.LIST_ACCESS_FAILED,
        error,
      );
    }
  }

  // 6. Remove access for a specific email
  async removeAccess(linkToken: string, accessId: string): Promise<void> {
    try {
      const link = await this.prisma.link.findUnique({
        where: { linkToken },
      });

      if (!link)
        throw new NotFoundException(ACCESS_MESSAGES.LINK_TOKEN_INVALID);

      const access = await this.prisma.access.findUnique({
        where: { id: accessId },
      });

      if (!access)
        throw new NotFoundException(ACCESS_MESSAGES.ACCESS_NOT_FOUND);

      await this.prisma.access.delete({ where: { id: accessId } });
    } catch (error) {
      throw new InternalServerErrorException(
        ACCESS_MESSAGES.REMOVE_ACCESS_FAILED,
        error,
      );
    }
  }
}
