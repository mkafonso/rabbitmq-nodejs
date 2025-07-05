import { Injectable } from '@nestjs/common';
import { MessageEntity } from 'src/messages/entities/message.entity';
import { PrismaService } from '../../../database/prisma.service';
import {
  IMessageRepositoryInterface,
  MessageWithUser,
} from '../message.repository';

@Injectable()
export class PrismaMessageRepository implements IMessageRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async save(message: MessageEntity): Promise<void> {
    await this.prisma.message.create({
      data: {
        id: message.getId(),
        encryptedContent: message.getEncryptedContent(),
        createdAt: message.getCreatedAt(),
        sender: {
          connect: {
            id: message.getSenderId(),
          },
        },
      },
    });
  }

  async findPaginated(page: number, perPage: number): Promise<MessageEntity[]> {
    const messages = await this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return messages.map(
      (msg) =>
        new MessageEntity(
          msg.id,
          msg.encryptedContent,
          msg.senderId,
          msg.createdAt,
        ),
    );
  }

  async findPaginatedWithUser(
    page: number,
    perPage: number,
  ): Promise<MessageWithUser[]> {
    const messages = await this.prisma.message.findMany({
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return messages.map((msg) => ({
      id: msg.id,
      encryptedContent: msg.encryptedContent,
      senderId: msg.senderId,
      createdAt: msg.createdAt,
      sender: {
        id: msg.sender.id,
        username: msg.sender.username,
      },
    }));
  }

  async count(): Promise<number> {
    return this.prisma.message.count();
  }
}
