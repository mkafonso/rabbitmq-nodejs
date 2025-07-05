import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  MessageQueueData,
  RabbitMQProvider,
} from '../../rabbitmq/rabbitmq.provider';
import { decrypt } from '../utils/decrypt';

export interface FunnelStatus {
  messageId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processedAt?: Date;
  error?: string;
}

@Injectable()
export class MessageFunnelProcessorService implements OnModuleInit {
  constructor(private readonly rabbitMQ: RabbitMQProvider) {}

  async onModuleInit() {
    await this.rabbitMQ.waitForInitialization();
    await this.rabbitMQ.consume('messages', async (messageData) => {
      await this.processMessage(messageData);
    });
  }

  private async processMessage(messageData: MessageQueueData): Promise<void> {
    try {
      console.log(
        `Processing message ${messageData.id} from sender ${messageData.senderId}`,
      );

      const decryptedContent = decrypt(messageData.encryptedContent);
      const funnelStatus = await this.analyzeFunnelStatus(decryptedContent);

      await this.updateFunnelStatus({
        messageId: messageData.id,
        status: funnelStatus,
        processedAt: new Date(),
      });

      console.log(
        `Message ${messageData.id} processed with status: ${funnelStatus}`,
      );
    } catch (error) {
      console.error(`Error processing message ${messageData.id}:`, error);

      await this.updateFunnelStatus({
        messageId: messageData.id,
        status: 'failed',
        processedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  private async analyzeFunnelStatus(
    content: string,
  ): Promise<'pending' | 'processing' | 'completed' | 'failed'> {
    // [TODO] Simula análise de conteúdo para determinar status do funil
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

  private async updateFunnelStatus(status: FunnelStatus): Promise<void> {
    //[TODO] Em um cenário real, isso seria salvo em uma tabela de status de funil
    console.log('>>>>>>>> Funnel status updated:', {
      messageId: status.messageId,
      status: status.status,
      processedAt: status.processedAt,
      error: status.error,
    });
  }
}
