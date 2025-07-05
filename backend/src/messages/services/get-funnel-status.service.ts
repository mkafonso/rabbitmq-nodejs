import { Injectable } from '@nestjs/common';
import {
  FunnelStatusResponseDto,
  GetFunnelStatusRequestDto,
} from '../dtos/funnel-status.dto';
import { IMessageRepositoryInterface } from '../repositories/message.repository';
import { decrypt } from '../utils/decrypt';

@Injectable()
export class GetFunnelStatusService {
  constructor(
    private readonly messageRepository: IMessageRepositoryInterface,
  ) {}

  async execute(
    data: GetFunnelStatusRequestDto,
  ): Promise<FunnelStatusResponseDto[]> {
    const { messageId, senderId } = data;

    if (messageId) {
      const messages = await this.messageRepository.findPaginated(1, 1000);
      const message = messages.find((m) => m.getId() === messageId);

      if (!message) {
        return [];
      }

      return [this.createFunnelStatusResponse(message)];
    }

    if (senderId) {
      const messages = await this.messageRepository.findPaginated(1, 1000);
      const senderMessages = messages.filter(
        (m) => m.getSenderId() === senderId,
      );

      return senderMessages.map((message) =>
        this.createFunnelStatusResponse(message),
      );
    }

    const messages = await this.messageRepository.findPaginated(1, 1000);
    return messages.map((message) => this.createFunnelStatusResponse(message));
  }

  private createFunnelStatusResponse(message: any): FunnelStatusResponseDto {
    const decryptedContent = decrypt(message.getEncryptedContent());
    const funnelStatus = this.analyzeFunnelStatus(decryptedContent);

    return {
      messageId: message.getId(),
      status: funnelStatus,
      processedAt: new Date(),
      senderId: message.getSenderId(),
      createdAt: message.getCreatedAt(),
      content: decryptedContent,
    };
  }

  // [TODO] ESSE E apenas um exemplo... aqui poderia utilizaria um LLM ou outra estratégia para analisar
  private analyzeFunnelStatus(
    content: string,
  ): 'pending' | 'processing' | 'completed' | 'failed' {
    const lowerContent = content.toLowerCase();

    if (
      lowerContent.includes('comprar') ||
      lowerContent.includes('adquirir') ||
      lowerContent.includes('fechar')
    ) {
      return 'completed';
    }

    if (
      lowerContent.includes('não') ||
      lowerContent.includes('cancelar') ||
      lowerContent.includes('desistir')
    ) {
      return 'failed';
    }

    if (
      lowerContent.includes('interesse') ||
      lowerContent.includes('quero') ||
      lowerContent.includes('gostaria')
    ) {
      return 'processing';
    }

    return 'pending';
  }
}
