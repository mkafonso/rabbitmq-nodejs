import { MessageEntity } from '../entities/message.entity';

export abstract class IMessageRepositoryInterface {
  abstract save(message: MessageEntity): Promise<void>;

  abstract findPaginated(
    page: number,
    perPage: number,
  ): Promise<MessageEntity[]>;
}
