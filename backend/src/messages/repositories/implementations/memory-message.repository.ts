import { MessageEntity } from '../../entities/message.entity';
import { IMessageRepositoryInterface } from '../message.repository';

export class InMemoryMessageRepository implements IMessageRepositoryInterface {
  private messages: MessageEntity[] = [];

  async save(message: MessageEntity): Promise<void> {
    this.messages.unshift(message);
  }

  async findPaginated(page: number, perPage: number): Promise<MessageEntity[]> {
    const startIndex = (page - 1) * perPage;
    return this.messages.slice(startIndex, startIndex + perPage);
  }

  async count(): Promise<number> {
    return this.messages.length;
  }

  reset(): void {
    this.messages = [];
  }
}
