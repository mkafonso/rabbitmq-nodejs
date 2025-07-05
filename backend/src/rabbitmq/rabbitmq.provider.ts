import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';

@Injectable()
export class RabbitMQProvider implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.ChannelWrapper;

  async onModuleInit() {
    const connection = amqp.connect([
      process.env.RABBITMQ_URL || 'amqp://localhost',
    ]);

    this.channel = connection.createChannel({
      json: true,
      setup: async (channel: amqp.Channel) => {
        await channel.assertQueue('messages', { durable: true });
      },
    });
  }

  async publish(queue: string, message: unknown): Promise<void> {
    await this.channel.sendToQueue(queue, message);
  }

  async onModuleDestroy() {
    await this.channel.close();
  }
}
