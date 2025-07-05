import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';

export interface MessageQueueData {
  id: string;
  encryptedContent: string;
  senderId: string;
  createdAt: Date;
}

@Injectable()
export class RabbitMQProvider implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.ChannelWrapper;
  private consumerChannel: amqp.ChannelWrapper;
  private isInitialized = false;
  private initialized: Promise<void>;
  private resolveInitialized: () => void;

  constructor() {
    this.initialized = new Promise((resolve) => {
      this.resolveInitialized = resolve;
    });
  }

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

    this.consumerChannel = connection.createChannel({
      json: true,
      setup: async (channel: amqp.Channel) => {
        await channel.assertQueue('messages', { durable: true });
        await channel.prefetch(1);
      },
    });

    await this.channel.waitForConnect();
    await this.consumerChannel.waitForConnect();
    this.isInitialized = true;
    if (this.resolveInitialized) {
      this.resolveInitialized();
    }
  }

  async waitForInitialization() {
    await this.initialized;
  }

  async publish(queue: string, message: unknown): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('RabbitMQ provider is not initialized yet');
    }
    await this.channel.sendToQueue(queue, message);
  }

  async consume(
    queue: string,
    callback: (message: MessageQueueData) => Promise<void>,
  ): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('RabbitMQ provider is not initialized yet');
    }

    await this.consumerChannel.consume(queue, (message) => {
      if (message) {
        try {
          const content = JSON.parse(
            message.content.toString(),
          ) as MessageQueueData;

          void callback(content).then(() => {
            this.consumerChannel.ack(message);
          });
        } catch (error) {
          console.error('Error processing message:', error);
          this.consumerChannel.nack(message, false, true);
        }
      }
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.consumerChannel.close();
  }
}
