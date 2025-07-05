import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './accounts.controller';
import { InMemoryUserRepository } from './repositories/implementations/memory-user.repository';
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
    {
      provide: IUserRepositoryInterface,
      useClass: InMemoryUserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [],
})
export class AccountsModule {}
