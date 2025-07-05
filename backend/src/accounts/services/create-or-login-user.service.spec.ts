import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity';
import { InMemoryUserRepository } from '../repositories/implementations/memory-user.repository';
import { CreateOrLoginUserService } from './create-or-login-user.service';

describe('[accounts] CreateOrLoginUserService', () => {
  let service: CreateOrLoginUserService;
  let userRepository: InMemoryUserRepository;
  let jwtService: JwtService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('um-token-muito-bonito'),
    } as any;

    service = new CreateOrLoginUserService(userRepository, jwtService);
  });

  afterEach(() => {
    userRepository.reset();
  });

  it('should create a user and return a token if not found', async () => {
    const data = {
      username: 'mkafonso',
      password: 'MinhaSenhaSuperSegura@123',
    };

    const result = await service.execute(data);

    expect(result).toEqual({
      access_token: 'um-token-muito-bonito',
      user: expect.objectContaining({ username: 'mkafonso' }),
    });

    const savedUser = await userRepository.findByUsername('mkafonso');
    expect(savedUser).toBeDefined();
  });

  it('should return token if existing user logs in with correct password', async () => {
    const password = 'MinhaSenhaSuperSegura@123';
    const hash = await bcrypt.hash(password, 12);
    const user = UserEntity.createNew('mkafonso', hash);
    await userRepository.save(user);

    const result = await service.execute({ username: 'mkafonso', password });

    expect(result.user.id).toBe(user.getId());
    expect(result.access_token).toBe('um-token-muito-bonito');
  });

  it('should throw UnauthorizedException if existing user logs in with incorrect password', async () => {
    const hash = await bcrypt.hash('MinhaSenhaSuperSegura@123', 12);
    const user = UserEntity.createNew('mkafonso', hash);
    await userRepository.save(user);

    await expect(
      service.execute({ username: 'mkafonso', password: 'SenhaErrada@123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
