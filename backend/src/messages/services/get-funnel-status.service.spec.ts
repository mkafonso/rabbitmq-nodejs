process.env.ENCRYPTION_KEY = '12345678123456781234567812345678';

import { UserEntity } from '../../accounts/entities/user.entity';
import { MessageEntity } from '../entities/message.entity';
import { InMemoryMessageRepository } from '../repositories/implementations/memory-message.repository';
import { GetFunnelStatusService } from './get-funnel-status.service';

describe('[messages] GetFunnelStatusService', () => {
  let service: GetFunnelStatusService;
  let messageRepository: InMemoryMessageRepository;

  beforeEach(() => {
    messageRepository = new InMemoryMessageRepository();
    service = new GetFunnelStatusService(messageRepository);
  });

  afterEach(() => {
    messageRepository.reset();
  });

  it('should return funnel status for all messages when no filters provided', async () => {
    const user = UserEntity.createNew('mkafonso', 'MinhaSenhaSuperSegura@123');
    const message1 = MessageEntity.createNew(
      user.getId(),
      'Tenho interesse no produto',
    );
    const message2 = MessageEntity.createNew(user.getId(), 'Vou comprar agora');

    await messageRepository.save(message1);
    await messageRepository.save(message2);

    const result = await service.execute({});

    expect(result).toHaveLength(2);
    expect(result[0].status).toBe('completed');
    expect(result[1].status).toBe('processing');
  });

  it('should return funnel status for specific message by ID', async () => {
    const user = UserEntity.createNew('mkafonso', 'MinhaSenhaSuperSegura@123');
    const message = MessageEntity.createNew(
      user.getId(),
      'Quero fechar o negócio',
    );

    await messageRepository.save(message);

    const result = await service.execute({ messageId: message.getId() });

    expect(result).toHaveLength(1);
    expect(result[0].messageId).toBe(message.getId());
    expect(result[0].status).toBe('completed');
  });
});
