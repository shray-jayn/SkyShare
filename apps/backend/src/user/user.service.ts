import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { USER_MESSAGES } from './constants/messages';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from './interfaces/auth-responce.interface';
import { UserProfileResponse } from './interfaces/user-profile-response.interface';
import { UpdateProfileResponse } from './interfaces/update-profile-response.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    try {
      const { email, name, password } = registerUserDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new UnauthorizedException({
          message: USER_MESSAGES.EMAIL_ALREADY_EXISTS,
          code: 'EMAIL_ALREADY_EXISTS',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      const token = this.generateToken(user);

      return {
        message: USER_MESSAGES.REGISTER_SUCCESS,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          usedStorage: user.usedStorage,
          storageQuota: user.storageQuota,
          createdAt: user.createdAt,
          updatedAt: user.createdAt,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    try {
      const { email, password } = loginUserDto;
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException({
          message: USER_MESSAGES.INVALID_CREDENTIALS,
          code: 'INVALID_CREDENTIALS',
        });
      }

      const token = this.generateToken(user);

      return {
        message: USER_MESSAGES.LOGIN_SUCCESS,
        user: {
          id: user.id,
          email: user.email,
          usedStorage: user.usedStorage,
          storageQuota: user.storageQuota,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId: string): Promise<UserProfileResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, createdAt: true, updatedAt: true },
      });

      if (!user) {
        throw new NotFoundException({
          message: USER_MESSAGES.PROFILE_NOT_FOUND,
          code: 'PROFILE_NOT_FOUND',
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateProfileResponse> {
    try {
      const { email, password } = updateUserDto;

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException({
          message: USER_MESSAGES.PROFILE_NOT_FOUND,
          code: 'PROFILE_NOT_FOUND',
        });
      }

      const updatedData: Partial<{ email: string; password: string }> = {};
      if (email) updatedData.email = email;
      if (password) updatedData.password = await bcrypt.hash(password, 10);

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updatedData,
        select: { id: true, email: true, updatedAt: true },
      });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteProfile(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException({
          message: USER_MESSAGES.PROFILE_NOT_FOUND,
          code: 'PROFILE_NOT_FOUND',
        });
      }

      await this.prisma.user.delete({ where: { id: userId } });
      return true;
    } catch (error) {
      throw error;
    }
  }

  private generateToken(user: { id: string; email: string }): string {
    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const expiresIn = this.configService.get<string | number>(
        'JWT_EXPIRES_IN_SECONDS',
      );

      const payload = { sub: user.id, email: user.email };

      return this.jwtService.sign(payload, {
        secret,
        expiresIn: Number(expiresIn),
      });
    } catch (error) {
      throw error;
    }
  }
}
