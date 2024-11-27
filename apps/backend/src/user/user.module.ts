import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule], 
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
