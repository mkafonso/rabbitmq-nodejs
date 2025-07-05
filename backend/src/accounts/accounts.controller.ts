import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { CreateOrLoginUserService } from './services/create-or-login-user.service';
import { CurrentUser as CurrentUserType } from './types/current-user.type';

@Controller('/api/v1/users')
export class UsersController {
  constructor(
    private readonly createOrLoginUserService: CreateOrLoginUserService,
  ) {}

  @Post()
  async authenticateUser(@Body() dto: any) {
    return this.createOrLoginUserService.execute(dto);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() user: CurrentUserType) {
    return {
      id: user.id,
      username: user.username,
    };
  }
}
