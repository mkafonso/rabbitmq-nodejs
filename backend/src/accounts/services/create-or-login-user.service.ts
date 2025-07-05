import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  CreateOrLoginUserRequestDto,
  CreateOrLoginUserResponseDto,
} from '../dtos/create-or-login-user.dto';
import { UserEntity } from '../entities/user.entity';
import { IUserRepositoryInterface } from '../repositories/user.repository';

@Injectable()
export class CreateOrLoginUserService {
  private readonly saltRounds = 12;

  constructor(
    private readonly userRepository: IUserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    data: CreateOrLoginUserRequestDto,
  ): Promise<CreateOrLoginUserResponseDto> {
    const user = await this.findOrCreateUser(data.username, data.password);
    const token = await this.generateAccessToken(user);

    return {
      access_token: token,
      user: {
        id: user.getId(),
        username: user.getUsername(),
      },
    };
  }

  private async findOrCreateUser(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      const ok = await bcrypt.compare(password, existingUser.getPasswordHash());
      if (!ok) {
        throw new UnauthorizedException(
          'Invalid credentials or Username already taken',
        );
      }

      return existingUser;
    }

    return this.createUser(username, password);
  }

  private async createUser(
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const hash = await bcrypt.hash(password, this.saltRounds);
    const newUser = UserEntity.createNew(username, hash);

    await this.userRepository.save(newUser);

    return newUser;
  }

  private async generateAccessToken(user: UserEntity): Promise<string> {
    const payload = {
      sub: user.getId(),
    };

    return this.jwtService.signAsync(payload);
  }
}
