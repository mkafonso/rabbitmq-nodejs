import { Injectable } from '@nestjs/common';
import { IUserRepositoryInterface } from '../../accounts/repositories/user.repository';
import {
  ListMessagesRequestDto,
  ListMessagesResponseDto,
} from '../dtos/list-messages.dto';
import { IMessageRepositoryInterface } from '../repositories/message.repository';
import { decrypt } from '../utils/decrypt';

@Injectable()
export class ListMessagesService {
  constructor(
    private readonly messageRepository: IMessageRepositoryInterface,
    private readonly userRepository: IUserRepositoryInterface,
  ) {}

  async execute(
    data: ListMessagesRequestDto,
  ): Promise<ListMessagesResponseDto> {
    const { page = 1, perPage = 15 } = data;

    const messages = await this.messageRepository.findPaginated(page, perPage);
    const total = await this.messageRepository.count();
    const totalPages = Math.ceil(total / perPage);

    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const user = await this.userRepository.findById(message.getSenderId());
        const decryptedContent = decrypt(message.getEncryptedContent());

        return {
          id: message.getId(),
          content: decryptedContent,
          senderId: message.getSenderId(),
          senderUsername: user?.getUsername() || 'Unknown User',
          createdAt: message.getCreatedAt(),
        };
      }),
    );

    return {
      messages: messagesWithUsers,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
    };
  }
}
