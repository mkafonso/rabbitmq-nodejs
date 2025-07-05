process.env.ENCRYPTION_KEY = '12345678123456781234567812345678';

import { NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../accounts/entities/user.entity';
import { InMemoryUserRepository } from '../../accounts/repositories/implementations/memory-user.repository';
import { InMemoryMessageRepository } from '../repositories/implementations/memory-message.repository';
import { SendMessageService } from './send-message.service';

describe('[messages] SendMessageService', () => {
  let service: SendMessageService;
  let messageRepository: InMemoryMessageRepository;
  let userRepository: InMemoryUserRepository;
  let rabbitMQ: { publish: jest.Mock };

  beforeEach(() => {
    messageRepository = new InMemoryMessageRepository();
    userRepository = new InMemoryUserRepository();
    rabbitMQ = { publish: jest.fn() };

    service = new SendMessageService(
      messageRepository,
      userRepository,
      rabbitMQ as any,
    );
  });

  afterEach(() => {
    messageRepository.reset();
    userRepository.reset();
  });

  it('should send a message and publish it if user exists', async () => {
    const user = UserEntity.createNew('mkafonso', 'MinhaSenhaSuperSegura@123');
    await userRepository.save(user);

    const data = {
      senderId: user.getId(),
      content: 'Minha mensagem enviada em algum chat',
    };

    await service.execute(data);

    const messages = await messageRepository.findPaginated(1, 10);
    expect(messages).toHaveLength(1);

    const savedMessage = messages[0];
    expect(savedMessage.getSenderId()).toBe(user.getId());

    expect(rabbitMQ.publish).toHaveBeenCalledWith('messages', {
      id: savedMessage.getId(),
      encryptedContent: savedMessage.getEncryptedContent(),
      senderId: savedMessage.getSenderId(),
      createdAt: savedMessage.getCreatedAt(),
    });
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const data = {
      senderId: 'um-sender-id-desconhecido',
      content: 'Deve falhar...',
    };

    await expect(service.execute(data)).rejects.toThrow(NotFoundException);
    expect(rabbitMQ.publish).not.toHaveBeenCalled();
  });
});
