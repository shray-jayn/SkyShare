import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { USER_MESSAGES } from './constants/messages';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      const user = await this.userService.register(registerUserDto);
      return {
        message: USER_MESSAGES.REGISTER_SUCCESS,
        data: user,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(USER_MESSAGES.REGISTER_FAILED);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.userService.login(loginUserDto);
      if (!user.token) {
        throw new UnauthorizedException(USER_MESSAGES.INVALID_CREDENTIALS);
      }
      return {
        message: USER_MESSAGES.LOGIN_SUCCESS,
        data: user,
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException(USER_MESSAGES.LOGIN_FAILED);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req) {
    try {
      const profile = await this.userService.getProfile(req.user.id);
      if (!profile) {
        throw new NotFoundException(USER_MESSAGES.PROFILE_NOT_FOUND);
      }
      return {
        message: USER_MESSAGES.PROFILE_RETRIEVE_SUCCESS,
        data: profile,
      };
    } catch (error) {
      console.error(error);
      throw new NotFoundException(USER_MESSAGES.PROFILE_NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    try {
      const updatedUser = await this.userService.updateProfile(
        req.user.id,
        updateUserDto,
      );
      if (!updatedUser) {
        throw new NotFoundException(USER_MESSAGES.PROFILE_NOT_FOUND);
      }
      return {
        message: USER_MESSAGES.PROFILE_UPDATE_SUCCESS,
        data: updatedUser,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(USER_MESSAGES.PROFILE_UPDATE_FAILED);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@Req() req) {
    try {
      const result = await this.userService.deleteProfile(req.user.id);
      if (!result) {
        throw new NotFoundException(USER_MESSAGES.PROFILE_NOT_FOUND);
      }
      return;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(USER_MESSAGES.PROFILE_DELETE_FAILED);
    }
  }
}
