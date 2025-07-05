import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepositoryInterface } from '../../accounts/repositories/user.repository';
import { RabbitMQProvider } from '../../rabbitmq/rabbitmq.provider';
import {
  SendMessageRequestDto,
  SendMessageResponseDto,
} from '../dtos/send-message.dto';
import { MessageEntity } from '../entities/message.entity';
import { IMessageRepositoryInterface } from '../repositories/message.repository';

@Injectable()
export class SendMessageService {
  constructor(
    private readonly messageRepo: IMessageRepositoryInterface,
    private readonly userRepository: IUserRepositoryInterface,
    private readonly rabbitMQ: RabbitMQProvider,
  ) {}

  async execute(
    data: SendMessageRequestDto & { senderId: string },
  ): Promise<SendMessageResponseDto> {
    const user = await this.userRepository.findById(data.senderId);
    if (!user) {
      throw new NotFoundException('SenderId not found');
    }

    const message = MessageEntity.createNew(data.senderId, data.content);

    await this.messageRepo.save(message);

    await this.rabbitMQ.publish('messages', {
      id: message.getId(),
      encryptedContent: message.getEncryptedContent(),
      senderId: message.getSenderId(),
      createdAt: message.getCreatedAt(),
    });
  }
}
