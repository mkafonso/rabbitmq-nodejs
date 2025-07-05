process.env.ENCRYPTION_KEY = '12345678123456781234567812345678';

import { UserEntity } from '../../accounts/entities/user.entity';
import { MessageEntity } from '../entities/message.entity';
import { InMemoryMessageRepository } from '../repositories/implementations/memory-message.repository';
import { ListMessagesService } from './list-messages.service';

describe('[messages] ListMessagesService', () => {
  let service: ListMessagesService;
  let messageRepository: InMemoryMessageRepository;

  beforeEach(() => {
    messageRepository = new InMemoryMessageRepository();

    service = new ListMessagesService(messageRepository);
  });

  afterEach(() => {
    messageRepository.reset();
  });

  it('should list messages with pagination', async () => {
    const user = UserEntity.createNew('mkafonso', 'MinhaSenhaSuperSegura@123');

    const message1 = MessageEntity.createNew(user.getId(), 'Primeira mensagem');
    const message2 = MessageEntity.createNew(user.getId(), 'Segunda mensagem');
    const message3 = MessageEntity.createNew(user.getId(), 'Terceira mensagem');

    await messageRepository.save(message1);
    await messageRepository.save(message2);
    await messageRepository.save(message3);

    const result = await service.execute({ page: 1, perPage: 2 });

    expect(result.messages).toHaveLength(2);
    expect(result.pagination).toEqual({
      page: 1,
      per_page: 2,
      total: 3,
      total_pages: 2,
    });

    expect(result.messages[0].content).toBe('Terceira mensagem');
    expect(result.messages[1].content).toBe('Segunda mensagem');
    expect(result.messages[0].sender_username).toBe('mkafonso');
    expect(result.messages[1].sender_username).toBe('mkafonso');
  });

  it('should return empty array when no messages exist', async () => {
    const result = await service.execute({ page: 1, perPage: 15 });

    expect(result.messages).toHaveLength(0);
    expect(result.pagination).toEqual({
      page: 1,
      per_page: 15,
      total: 0,
      total_pages: 0,
    });
  });

  it('should use default values when no pagination is provided', async () => {
    const result = await service.execute({});

    expect(result.pagination).toEqual({
      page: 1,
      per_page: 15,
      total: 0,
      total_pages: 0,
    });
  });
});
