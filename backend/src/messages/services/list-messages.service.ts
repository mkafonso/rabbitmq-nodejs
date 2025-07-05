import { Injectable } from '@nestjs/common';
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
  ) {}

  async execute(
    data: ListMessagesRequestDto,
  ): Promise<ListMessagesResponseDto> {
    const { page = 1, perPage = 15 } = data;

    const messagesWithUsers =
      await this.messageRepository.findPaginatedWithUser(page, perPage);
    const total = await this.messageRepository.count();
    const totalPages = Math.ceil(total / perPage);

    const messages = messagesWithUsers.map((messageWithUser) => {
      const decryptedContent = decrypt(messageWithUser.encryptedContent);

      return {
        id: messageWithUser.id,
        content: decryptedContent,
        sender_id: messageWithUser.senderId,
        sender_username: messageWithUser.sender.username,
        created_at: messageWithUser.createdAt,
      };
    });

    return {
      messages,
      pagination: {
        page,
        total,
        per_page: perPage,
        total_pages: totalPages,
      },
    };
  }
}
