import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { RabbitMQProvider } from 'src/rabbitmq/rabbitmq.provider';
import { MessagesController } from './messages.controller';
import { PrismaMessageRepository } from './repositories/implementations/prisma-message.repository';
import { IMessageRepositoryInterface } from './repositories/message.repository';
import { GetFunnelStatusService } from './services/get-funnel-status.service';
import { ListMessagesService } from './services/list-messages.service';
import { MessageFunnelProcessorService } from './services/message-funnel-processor.service';
import { SendMessageService } from './services/send-message.service';

@Module({
  imports: [AccountsModule],
  providers: [
    SendMessageService,
    ListMessagesService,
    MessageFunnelProcessorService,
    GetFunnelStatusService,
    RabbitMQProvider,
    {
      provide: IMessageRepositoryInterface,
      useClass: PrismaMessageRepository,
    },
  ],
  controllers: [MessagesController],
  exports: [],
})
export class MessagesModule {}
