import { MessageEntity } from '../entities/message.entity';

export interface MessageWithUser {
  id: string;
  encryptedContent: string;
  senderId: string;
  createdAt: Date;
  sender: {
    id: string;
    username: string;
  };
}

export abstract class IMessageRepositoryInterface {
  abstract save(message: MessageEntity): Promise<void>;

  abstract findPaginated(
    page: number,
    perPage: number,
  ): Promise<MessageEntity[]>;

  abstract findPaginatedWithUser(
    page: number,
    perPage: number,
  ): Promise<MessageWithUser[]>;

  abstract count(): Promise<number>;
}
