import { MessageEntity } from '../../entities/message.entity';
import {
  IMessageRepositoryInterface,
  MessageWithUser,
} from '../message.repository';

export class InMemoryMessageRepository implements IMessageRepositoryInterface {
  private messages: MessageEntity[] = [];

  async save(message: MessageEntity): Promise<void> {
    this.messages.unshift(message);
  }

  async findPaginated(page: number, perPage: number): Promise<MessageEntity[]> {
    const startIndex = (page - 1) * perPage;
    return this.messages.slice(startIndex, startIndex + perPage);
  }

  async findPaginatedWithUser(
    page: number,
    perPage: number,
  ): Promise<MessageWithUser[]> {
    const startIndex = (page - 1) * perPage;
    const messages = this.messages.slice(startIndex, startIndex + perPage);

    return messages.map((message) => ({
      id: message.getId(),
      encryptedContent: message.getEncryptedContent(),
      senderId: message.getSenderId(),
      createdAt: message.getCreatedAt(),
      sender: {
        id: message.getSenderId(),
        username: 'mkafonso',
      },
    }));
  }

  async count(): Promise<number> {
    return this.messages.length;
  }

  reset(): void {
    this.messages = [];
  }
}
