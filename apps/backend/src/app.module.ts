import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { AccessModule } from './access/access.module';
import { SearchModule } from './search/search.module';
import { MailerModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    FileModule,
    AccessModule,
    SearchModule,
    MailerModule,
  ],
})
export class AppModule {}
