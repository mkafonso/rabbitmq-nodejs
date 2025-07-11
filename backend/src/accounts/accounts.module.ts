import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './accounts.controller';
import { AuthGuard } from './guards/auth.guard';
import { PrismaUserRepository } from './repositories/implementations/prisma-user.repository';
import { IUserRepositoryInterface } from './repositories/user.repository';
import { CreateOrLoginUserService } from './services/create-or-login-user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [
    CreateOrLoginUserService,
    AuthGuard,
    {
      provide: IUserRepositoryInterface,
      useClass: PrismaUserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [IUserRepositoryInterface, AuthGuard],
})
export class AccountsModule {}
