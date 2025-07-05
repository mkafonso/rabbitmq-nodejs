import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrLoginUserService } from './services/create-or-login-user.service';

@Controller('/api/v1/users')
export class UsersController {
  constructor(
    private readonly createOrLoginUserService: CreateOrLoginUserService,
  ) {}

  @Post()
  async authenticateUser(@Body() dto: any) {
    return this.createOrLoginUserService.execute(dto);
  }
}
