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
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthResponse } from './interfaces/auth-responce.interface';
import { UserProfileResponse } from './interfaces/user-profile-response.interface';
import { UpdateProfileResponse } from './interfaces/update-profile-response.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    return await this.userService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return await this.userService.login(loginUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req): Promise<UserProfileResponse> {
    return await this.userService.getProfile(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ): Promise<UpdateProfileResponse> {
    return await this.userService.updateProfile(req.user.id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@Req() req): Promise<void> {
    await this.userService.deleteProfile(req.user.id);
  }
}
