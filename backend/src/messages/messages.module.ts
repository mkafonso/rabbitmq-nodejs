import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { RabbitMQProvider } from 'src/rabbitmq/rabbitmq.provider';
import { MessagesController } from './messages.controller';
import { PrismaMessageRepository } from './repositories/implementations/prisma-message.repository';
import { IMessageRepositoryInterface } from './repositories/message.repository';
import { ListMessagesService } from './services/list-messages.service';
import { SendMessageService } from './services/send-message.service';

@Module({
  imports: [AccountsModule],
  providers: [
    SendMessageService,
    ListMessagesService,
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
