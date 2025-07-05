import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../accounts/entities/user.entity';
import { PrismaService } from '../../../database/prisma.service';
import { IUserRepositoryInterface } from '../user.repository';

@Injectable()
export class PrismaUserRepository implements IUserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: UserEntity): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.getId() },
      update: {
        username: user.getUsername(),
        passwordHash: user.getPasswordHash(),
      },
      create: {
        id: user.getId(),
        username: user.getUsername(),
        passwordHash: user.getPasswordHash(),
        createdAt: user.getCreatedAt(),
      },
    });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.username,
      user.passwordHash,
      user.createdAt,
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.username,
      user.passwordHash,
      user.createdAt,
    );
  }
}
